import moment from "moment";

export const formatDate = (dateString: string | undefined, isAmPm: boolean) => {
  if (!dateString) return "Unknown date";
  return moment(dateString).format(isAmPm ? "h:mm A" : "h:mm");
};
