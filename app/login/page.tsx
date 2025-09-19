import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";

export default function Login({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    const signIn = async (formData: FormData) => {
        "use server";

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const supabase = await createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return redirect("/login?message=Não foi possível fazer o login.");
        }

        return redirect("/");
    };

    const signUp = async (formData: FormData) => {
        "use server";

        const origin = (await headers()).get("origin");
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const supabase = await createClient();

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) {
            return redirect("/login?message=Não foi possível criar a conta.");
        }

        return redirect("/login?message=Verifique seu email para confirmar a conta.");
    };

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 m-auto">
            <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
                {/* Adiciona o logo aqui */}
                <div className="flex justify-center mb-8">
                    <img
                        src="https://dppyplipgqxgbovndyqw.supabase.co/storage/v1/object/public/perfil/perfil/Logo%20FA.png"
                        alt="Logo da Empresa"
                        className="w-40" // Ajuste o tamanho da imagem conforme necessário
                    />
                </div>

                <label className="text-md" htmlFor="email">
                    Email
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    name="email"
                    placeholder="seu@email.com"
                    required
                />
                <label className="text-md" htmlFor="password">
                    Senha
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                />
                <SubmitButton
                    formAction={signIn}
                    className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
                    pendingText="Entrando..."
                >
                    Entrar
                </SubmitButton>
                <SubmitButton
                    formAction={signUp}
                    className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
                    pendingText="Criando conta..."
                >
                    Criar conta
                </SubmitButton>
                {searchParams?.message && (
                    <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                        {searchParams.message}
                    </p>
                )}
            </form>
        </div>
    );
}