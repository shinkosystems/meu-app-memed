import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./login/submit-button";

export default async function Login({
    searchParams,
}: {
    searchParams: { message?: string };
}) {
    // Funções server actions
    async function signIn(formData: FormData) {
        "use server";
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const supabase = await createClient();

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return redirect("/?message=Não foi possível fazer o login!");
        return redirect("/account");
    }

    async function signUp(formData: FormData) {
        "use server";
        const origin = (await headers()).get("origin");
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const supabase = await createClient();

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${origin}/auth/callback` },
        });

        if (error) return redirect("/?message=Não foi possível criar a conta.");
        return redirect("/?message=Verifique seu email para confirmar a conta.");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center w-full max-w-md">
                {/* Logo */}
                <img
                    src="https://dppyplipgqxgbovndyqw.supabase.co/storage/v1/object/public/perfil/perfil/Logo%20FA.png"
                    alt="Logo da Empresa"
                    className="max-w-[320px] max-h-[200px] object-contain mb-8"
                />

                <form className="w-full flex flex-col items-center gap-4 text-gray-800">
                    <div className="w-full">
                        <label className="block text-md mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="h-14 w-full rounded-[40px] px-6 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                            id="email"
                            name="email"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-md mb-1" htmlFor="password">
                            Senha
                        </label>
                        <input
                            className="h-14 w-full rounded-[40px] px-6 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <SubmitButton
                        formAction={signIn}
                        className="h-14 w-full rounded-[40px] bg-green-700 text-white font-semibold hover:bg-green-800 transition"
                        pendingText="Entrando..."
                    >
                        Entrar
                    </SubmitButton>

                    <SubmitButton
                        formAction={signUp}
                        className="h-14 w-full rounded-[40px] border border-gray-400 text-gray-700 font-semibold hover:bg-gray-100 transition"
                        pendingText="Criando conta..."
                    >
                        Criar conta
                    </SubmitButton>

                    {searchParams?.message && (
                        <p className="mt-4 p-3 w-full bg-gray-100 text-center rounded">
                            {searchParams.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}