export function converterDataHora(data: Date | null): string {
    if (data == null) {
        return "";
    }
    data = new Date(data);
    return data.getDate().toString().padStart(2, "0") + "/" + (data.getMonth() + 1).toString().padStart(2, "0") + "/" + data.getFullYear().toString() + " " + data.getHours().toString().padStart(2, "0") + ":" + data.getMinutes().toString().padStart(2, "0");
}

export function converterData(data: Date | null): string {
    if (data == null) {
        return "";
    }
    data = new Date(data);
    return data.getDate().toString().padStart(2, "0") + "/" + (data.getMonth() + 1).toString().padStart(2, "0") + "/" + data.getFullYear().toString();
}