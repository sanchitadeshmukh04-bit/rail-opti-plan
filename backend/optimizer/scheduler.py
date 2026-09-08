from datetime import datetime
from typing import Dict, List, Tuple
from uuid import uuid4


MAINTENANCE_WINDOWS = [
    {
        "id": "MW1",
        "label": "Morning Window",
        "start": "10:00",
        "end": "13:00",
    },
    {
        "id": "MW2",
        "label": "Afternoon Window",
        "start": "13:30",
        "end": "16:30",
    },
    {
        "id": "MW3",
        "label": "Night Window",
        "start": "23:30",
        "end": "03:30",
    },
]


PRIORITY_WEIGHT = {
    "Critical": 40,
    "High": 28,
    "Medium": 15,
    "Low": 6,
}


def to_minutes(time_value: str) -> int:
    hour, minute = time_value.split(":")
    return int(hour) * 60 + int(minute)


def to_hhmm(minutes: int) -> str:
    minutes = minutes % 1440

    hour = minutes // 60
    minute = minutes % 60

    return f"{int(hour):02d}:{int(minute):02d}"


def train_conflicts(
    km_from: float,
    km_to: float,
    start: int,
    end: int,
    trains: List[Dict],
) -> List[Dict]:

    conflicts = []

    for train in trains:

        if not (
            train["km"] >= km_from - 1
            and train["km"] <= km_to + 1
        ):
            continue

        arrival = to_minutes(train["arrival"])
        departure = to_minutes(train["departure"])

        if departure < arrival:
            departure += 1440

        if arrival < end and departure > start:

            severity = (
                "High"
                if train["priority"] in ["Critical", "High"]
                else "Medium"
            )

            conflicts.append(
                {
                    "type": "Train movement",
                    "detail": (
                        f"Train {train['trainId']} "
                        f"({train['name']}) passes "
                        f"{train['location']} at "
                        f"{train['arrival']}"
                    ),
                    "severity": severity,
                }
            )

    return conflicts


def resource_conflict(
    tasks: List[Dict],
    resources: List[Dict],
):

    counts = {}

    for task in tasks:
        for resource in task["resources"]:
            counts[resource] = counts.get(resource, 0) + 1

    for name, used in counts.items():

        resource = next(
            (
                r for r in resources
                if r["name"] == name
            ),
            None,
        )

        if resource and used > resource["availableUnits"]:

            return (
                f"{name} required by {used} tasks, "
                f"but only "
                f"{resource['availableUnits']} "
                f"unit(s) are available"
            )

    return None


def find_clear_window(
    km_from: float,
    km_to: float,
    duration_minutes: int,
    trains: List[Dict],
):

    for window in MAINTENANCE_WINDOWS:

        start = to_minutes(window["start"])

        window_end = to_minutes(window["end"])

        if window_end < start:
            window_end += 1440

        while start + duration_minutes <= window_end:

            conflicts = train_conflicts(
                km_from,
                km_to,
                start,
                start + duration_minutes,
                trains,
            )

            if not conflicts:
                return {
                    "start": start,
                    "end": start + duration_minutes,
                }

            start += 15

    return None


def optimize(
    tasks: List[Dict],
    trains: List[Dict],
    assets: List[Dict],
    resources: List[Dict],
):

    pending = [
        task
        for task in tasks
        if task["status"] != "Completed"
    ]

    def risk(task):

        asset = next(
            (
                a for a in assets
                if a["assetId"] == task["assetId"]
            ),
            None,
        )

        return (
            float(asset.get("failureRisk", 40))
            if asset
            else 40
        )

    sorted_tasks = sorted(
        pending,
        key=lambda task:
            PRIORITY_WEIGHT[task["priority"]]
            + risk(task),
        reverse=True,
    )

    used = set()
    blocks = []
    unassigned = []

    block_number = 1

    for seed in sorted_tasks:

        if seed["id"] in used:
            continue

        group = [seed]
        used.add(seed["id"])

        for candidate in sorted_tasks:

            if candidate["id"] in used:
                continue

            if abs(candidate["km"] - seed["km"]) > 2:
                continue

            if candidate["requiredDate"] != seed["requiredDate"]:
                continue

            trial = group + [candidate]

            max_duration = max(
                task["duration"]
                for task in trial
            )

            if max_duration > 3:
                continue

            if resource_conflict(
                trial,
                resources,
            ):
                continue

            group.append(candidate)
            used.add(candidate["id"])

        km_from = min(
            task["km"]
            for task in group
        )

        km_to = max(
            task["km"]
            for task in group
        )

        departments = list(
            dict.fromkeys(
                task["department"]
                for task in group
            )
        )

        duration_minutes = (
            max(
                task["duration"]
                for task in group
            )
            * 60
            + (len(departments) - 1) * 15
        )

        preferred_start = to_minutes("10:00")

        start = preferred_start
        end = start + duration_minutes

        conflicts = train_conflicts(
            km_from,
            km_to,
            start,
            end,
            trains,
        )

        resource_issue = resource_conflict(
            group,
            resources,
        )

        if resource_issue:

            conflicts.append(
                {
                    "type": "Resource",
                    "detail": resource_issue,
                    "severity": "High",
                }
            )

        clear_window = find_clear_window(
            km_from,
            km_to,
            duration_minutes,
            trains,
        )

        suggested_start = None
        suggested_end = None

        if conflicts:

            if clear_window:

                suggested_start = to_hhmm(
                    clear_window["start"]
                )

                suggested_end = to_hhmm(
                    clear_window["end"]
                )

        elif clear_window:

            start = clear_window["start"]
            end = clear_window["end"]

        highest_priority = max(
            PRIORITY_WEIGHT[
                task["priority"]
            ]
            for task in group
        )

        highest_risk = max(
            risk(task)
            for task in group
        )

        score = round(
            min(
                99,
                40
                + len(group) * 8
                + len(departments) * 6
                + highest_priority * 0.4
                + highest_risk * 0.12
                - len(conflicts) * 18,
            )
        )

        reasons = [
            (
                f"{len(group)} task(s) share a "
                f"compatible location corridor "
                f"(KM {km_from}–{km_to})"
            ),
            (
                f"Departments: "
                f"{' + '.join(departments)}"
            ),
            (
                f"Highest failure risk: "
                f"{highest_risk:.0f}/100"
            ),
            (
                "Required equipment and manpower "
                "are available"
                if not resource_issue
                else resource_issue
            ),
        ]

        if conflicts:
            reasons.append(
                "Train movement conflict detected; "
                "alternative window evaluated"
            )
        else:
            reasons.append(
                "No protected train movement "
                "inside the selected window"
            )

        block = {
            "id": str(uuid4()),
            "blockId": f"B{block_number:03d}",
            "location": (
                f"KM {int(km_from)}"
                if km_from == km_to
                else f"KM {int(km_from)}–{int(km_to)}"
            ),
            "kmFrom": km_from,
            "kmTo": km_to,
            "date": seed["requiredDate"],
            "start": to_hhmm(start),
            "end": to_hhmm(end),
            "duration": round(
                duration_minutes / 60,
                2,
            ),
            "departments": departments,
            "taskIds": [
                task["taskId"]
                for task in group
            ],
            "status": (
                "Conflict"
                if conflicts
                else "Recommended"
            ),
            "score": score,
            "reasons": reasons,
            "conflicts": conflicts,
            "suggestedStart": suggested_start,
            "suggestedEnd": suggested_end,
            "availabilityGain": round(
                len(group) * 0.6,
                1,
            ),
        }

        blocks.append(block)

        block_number += 1

    for task in pending:

        if task["id"] not in used:

            unassigned.append(
                {
                    "taskId": task["taskId"],
                    "reason": "No compatible window found",
                }
            )

    return {
        "blocks": blocks,
        "unassigned": unassigned,
    }


def summarize(blocks: List[Dict]) -> Dict:

    active = [
        block
        for block in blocks
        if block["status"] != "Rejected"
    ]

    total_duration = sum(
        block["duration"]
        for block in active
    )

    total_tasks = sum(
        len(block["taskIds"])
        for block in active
    )

    total_conflicts = sum(
        len(block["conflicts"])
        for block in active
    )

    coordinated = sum(
        1
        for block in active
        if len(block["departments"]) > 1
    )

    average_score = (
        sum(block["score"] for block in active)
        / len(active)
        if active
        else 0
    )

    return {
        "blocks": len(active),
        "durationHours": round(
            total_duration,
            2,
        ),
        "coordinated": coordinated,
        "tasks": total_tasks,
        "conflicts": total_conflicts,
        "averageScore": round(
            average_score,
            2,
        ),
    }