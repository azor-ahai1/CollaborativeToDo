import mongoose from "mongoose";

const actionLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        action: {
            type: String,
            required: true
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: false
        },
        details: {
            type: Object,
            default: {}
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: false
    }
);

export const ActionLog = mongoose.model("ActionLog", actionLogSchema); 