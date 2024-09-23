export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const sendEvent = ({ event, action = "action-result", account, ...props }) => {
  return event.sender.send(action, { ...account, ...props });
}
