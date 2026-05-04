def estimate_wait_minutes(pending_count: int, avg_service_time: int) -> int:
    # Simple linear estimate
    try:
        pending = int(pending_count)
        avg = int(avg_service_time)
    except (TypeError, ValueError):
        return 0
    return pending * avg
