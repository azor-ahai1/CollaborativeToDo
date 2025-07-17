
# Logic Document

## Logic of Smart Assign

Smart Assign is designed to distribute tasks fairly among users.

### How it works:
1. Count Active Tasks: The backend counts the number of active (not Done) tasks assigned to each user.
2. Find Least Busy User:** It identifies the user with the fewest active tasks.
3. Assign Task: The selected task is assigned to this least busy user.
4. Update Board: The board is updated in real-time for all users, and the action is logged in the activity log.

**Example:**
- User A has 2 active tasks, User B has 1, User C has 0.
- You click "Smart Assign" on a new task.
- The task is assigned to User C, since they have the fewest active tasks.


----------------------------------------------------------------------------------------------------------------------------------------------

## Logic of Conflict Handling

Conflict Handling ensures that when multiple users try to edit the same task at the same time, no changes are lost and users are aware of concurrent updates.

### How it works:
1. Edit Detection: When a user tries to save edits to a task, the backend checks if the task was updated by someone else since the user started editing (using a timestamp).
2. Conflict Modal: If a conflict is detected, a modal appears showing:
   - Your Version: The changes you tried to save.
   - Server Version: The latest version of the task on the server.
3. Resolution Options:
   - Merge: Only the fields you changed (that differ from the server) are applied to the server version.
   - Overwrite: All your changes replace the server version, regardless of what changed.
4. Update & Log: The chosen resolution is applied, the board is updated for all users, and the action is logged.

**Example:**
- User A and User B both open Task X.
- User A changes the title and saves.
- User B changes the description and tries to save after User A.
- The backend detects a conflict. User B sees a modal:
  - Their attempted description change (Your Version)
  - The new title from User A (Server Version)
- User B chooses Merge: Only their description change is applied, keeping User A's title.
- Or, User B chooses Overwrite: Their version (including the old title and new description) replaces the server version.
