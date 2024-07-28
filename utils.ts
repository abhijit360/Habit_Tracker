export async function updateLocalTaskState(tasks: any) {
  await chrome.storage.session.set({
    current_task_state: JSON.stringify(tasks),
  });
}
