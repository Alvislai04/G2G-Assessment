const STORAGE_KEY = "todo-list";
const PRIORITY_ORDER = { urgent: 1, high: 2, medium: 3, low: 4 };

const app = Vue.createApp({
    data() {
        return {
            newTask: { text: "", priority: "", status: "", dueDate: "" },
            tasks: []
        };
    },
    computed: {
        // Active tasks (sorted by priority and due date)
        sortedActiveTasks() {
            return [...this.tasks]
                .filter(task => task.status !== 'complete' && task.status !== 'cancelled')
                .sort((a, b) => {
                    const pA = PRIORITY_ORDER[a.priority] || 99;
                    const pB = PRIORITY_ORDER[b.priority] || 99;
                    if (pA !== pB) return pA - pB;
                    if (a.dueDate && b.dueDate) {
                        return new Date(a.dueDate) - new Date(b.dueDate);
                    }
                    return 0;
                });
        },
        // Completed & Cancelled tasks (sorted by due date)
        sortedCompletedAndCancelledTasks() {
            return [...this.tasks]
                .filter(task => task.status === 'complete' || task.status === 'cancelled')
                .sort((a, b) => {
                    if (a.dueDate && b.dueDate) {
                        return new Date(a.dueDate) - new Date(b.dueDate);
                    }
                    return 0;
                });
        }
    },
    created() {
        // Load tasks from localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) this.tasks = JSON.parse(saved);
    },
    methods: {
        // Add new task
        addTask() {
            if (!this.newTask.text.trim() || !this.newTask.priority || !this.newTask.status || !this.newTask.dueDate) {
                alert("Please fill in all fields.");
                return;
            }
            // Add unique ID to each task
            const newTask = { ...this.newTask, id: Date.now() + Math.random() };
            this.tasks.unshift(newTask);
            this.saveTasks();
            this.newTask = { text: "", priority: "", status: "", dueDate: "" };
        },

        // Delete task
        deleteTask(taskId) {
            const index = this.tasks.findIndex(task => task.id === taskId);
            if (index > -1) {
                this.tasks.splice(index, 1);
                this.saveTasks();
            }
        },

        // Update task priority
        updateTaskPriority(taskId, newPriority) {
            const task = this.tasks.find(task => task.id === taskId);
            if (task) {
                task.priority = newPriority;
                this.saveTasks();
            }
        },

        // Update task status
        updateTaskStatus(taskId, newStatus) {
            const task = this.tasks.find(task => task.id === taskId);
            if (task) {
                task.status = newStatus;
                this.saveTasks();
            }
        },

        // Save tasks to localStorage
        saveTasks() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
        },

        // Format date for display
        formatDate(dateStr) {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            return d.toLocaleDateString();
        }
    }
});

app.mount("#app");
