export function qsFromObj(obj: Record<string, any>) {
    const qs = new URLSearchParams();

    Object.entries(obj).forEach(([k, v]) => qs.append(k, v));

    return qs.toString();
}
