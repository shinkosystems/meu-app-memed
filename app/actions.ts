'use server';

import LoginPage from "./page";

export async function handleLogin(formData: FormData) {
    // Implement login logic here
const email = formData.get('email');
const password = formData.get('password');
}

export async function handleSignUp(formData: FormData) {
    // Implement sign-up logic here
    const email = formData.get('email');
    const password = formData.get('password');
}