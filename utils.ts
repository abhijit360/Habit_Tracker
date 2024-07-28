export async function updateLocalTaskState(tasks) {
  await chrome.storage.session.set({
    current_task_state: JSON.stringify(tasks),
  });
}
