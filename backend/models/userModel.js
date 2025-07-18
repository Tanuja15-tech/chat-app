const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        pic: {
            type: String,
            default:
                "https://static.vecteezy.com/system/resources/previews/017/398/774/non_2x/3d-rendering-cute-rabbit-avatar-icon-illustration-year-of-the-rabbit-chinese-new-year-png.png",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) { // If the password is not modified, skip hashing
        return next();
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
