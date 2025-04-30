# Installation & Testing
After downloading the project, run "npm install" and everything should work.

# Structuring & Inclusion
TS files follow the standard order of things.  
SCSS & CSS classes follow the BEM standard and I nest the classes as much as possible.

I try to use ARIA on everything I understand needs ARIA for screen reader support (needs more practice).  
I also used a custom color palette together with Angular Material Components where I thought they were needed.

In the end, I used Prettier to format my project using instructions from a `.prettierrc` file.

# Styling SCSS & CSS
I use functions, mixins, resets, typography, and variable files in this project — which are shared styling files.  
Sometimes I decided to use regular CSS instead of SCSS because I felt I didn’t need the complexity of SCSS.

# Overall Explanation Of Project
It starts with the homepage where the user can create a new project.  
If there are no projects, it displays "No Projects to display".  
Otherwise, when a project is created, it gets an "id" attribute.  
When clicked, it sets a selectedProjectId value in a signal, and then it displays tasks that have a `projectId` matching that selectedProjectId value.  
If there are no tasks, it says "No Tasks To display".  
This does not cause a re-render because the tasks are already rendered onInit — they are just conditionally displayed based on the selected project ID.

The user can edit, remove, and create tasks. Projects are handled via a regular event-service which uses `.emit()` and listeners to remove or update projects.  
This works well since we are still on the same page where the listeners are active, so we never "miss timing".  
For **adding** tasks or projects, however, we are on a different page.  
At that point, I was using BehaviorSubjects but switched to Signals instead.  
So when adding a new task, it gets added to the Signal-based service, and then we are routed back to the homepage where the updated tasks or projects are reflected via signals.

Worth mentioning:  
The first created project (ID 1) automatically fetches tasks from the DummyJSON API via a service that does the HTTP request.  
This only triggers when localStorage is empty for that specific ID and it fills the project with 5 dummy tasks.

# Testing
Since I know I need to practice writing tests **a lot**, I intentionally only created **3 working test files** — for the components `Task-Item`, `Task-List`, and the service `Event-Service`.

# Generic Component
I created a generic button which I use in multiple places.  
This button receives `text`, `type`, and `disabled` as inputs from the parent, so it’s flexible and reusable.

# Signals
I understand the concept of signals and how they differ from BehaviorSubjects, but I still need more practice to feel comfortable with the syntax and use cases.

# Responsiveness
To improve responsiveness, I created a "snackbar" which acts as a popup when the user creates, edits, or removes tasks/projects. I also included an animated spinning icon when its waiting for the fetch for the dummy api posts to load.

# Filter
The task filter includes options for **All**, **Unfulfilled**, and **Fulfilled** tasks.  
The selected filter is passed from the `task-filter` component to the `task-todos` component, which filters tasks via a method in the signal service.  
It also applies the `selectedProjectId` filter so only tasks relevant to the current project are shown.  
These filtered tasks are rendered deeper down in the component tree.

# Progression
Each project has a progress bar (using Angular Material) that calculates completion based on how many tasks are marked as completed.

# Persist State
To preserve state, I used localStorage.  
This was a bit gimmicky since I had to manually update it everywhere, but it worked.  
I also made sure state is synced across tabs/windows by adding a `storage` event listener.

# Forms
All forms in the project are **reactive** and include several validators — including one custom validator for whitespace-only input.

# Custom
I added:
- A custom pipe to capitalize the first letter in some places.
- A custom directive that makes the edit button fully purple when hovered.
- A custom validator to block inputs that contain only blank spaces.

# Issues
The most challenging part was switching from BehaviorSubjects to Signals, as it took time to fully understand the core principles behind how Signals work.

Writing tests was also very difficult — and still is — because I need to spend more time learning and becoming confident with the syntax and structure of test files.

# Improvements
I need to repeat many things — especially Signals, writing tests, structuring TS files and building more custom pipes/directives — to fully master them.
