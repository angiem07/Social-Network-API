const { Schema, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: [true, "Please enter your reaction."],
            maxlength: [280, "Reaction cannot exceed 280 characters."]
        },
        username: {
            type: String,
            required: [true, "Username is required."],
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateFormat(createdAtVal),
        }
    }
);

module.exports = reactionSchema;
