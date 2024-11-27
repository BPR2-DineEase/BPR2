export const validateRegistrationInputs
    = ({email, password, firstName, lastName, role,}: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
}):
    string[] => {
    const errors = [];
    if (!email.includes("@")) errors.push("Invalid email format.");
    if (password.length < 6) errors.push("Password must be at least 6 characters.");
    if (!firstName.trim()) errors.push("First name is required.");
    if (!lastName.trim()) errors.push("Last name is required.");
    if (!["Customer", "RestaurantOwner"].includes(role)) errors.push("Invalid role.");
    return errors;
};