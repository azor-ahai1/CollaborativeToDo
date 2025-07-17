import mongoose from "mongoose";

const COLUMN_NAMES = ["Todo", "In Progress", "Done"];

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return !COLUMN_NAMES.includes(v);
                },
                message: "Task title must not match column names."
            }
        },
        description: {
            type: String,
            default: ""
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        status: {
            type: String,
            enum: ["Todo", "In Progress", "Done"],
            default: "Todo"
        },
        priority: {
            type: Number,
            default: 1
        },
        board: {
            type: String,
            default: "main"
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

taskSchema.index({ title: 1, board: 1 }, { unique: true });

taskSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Task = mongoose.model("Task", taskSchema); 