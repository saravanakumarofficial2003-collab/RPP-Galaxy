/******************************************************************
 * RPP BEAST GALAXY – ROLE & ACCESS ENGINE (ULTIMATE)
 * Purpose: Product-grade role separation
 ******************************************************************/

import fs from "fs";
import crypto from "crypto";

const USERS = "C:/RPP_GALAXY/Server/users.json";

function hash(pwd) {
    return crypto.createHash("sha256").update(pwd).digest("hex");
}

export function authenticate(username, password) {
    const users = JSON.parse(fs.readFileSync(USERS, "utf-8"));
    const user = users.find(u => u.username === username);

    if (!user) return null;
    if (user.password !== hash(password)) return null;

    return {
        username: user.username,
        role: user.role
    };
}
