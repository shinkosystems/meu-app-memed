import { handleLogin, handleSignUp } from '@/actions';

export default function LoginPage() {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Login ou Cadastro</h1>
            <form className="flex flex-col gap-4 p-8 bg-white shadow-lg rounded-lg w-full max-w-sm">
                <input
                    className="p-3 border rounded"
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                />
                <input
                    className="p-3 border rounded"
                    type="password"
                    name="password"
                    placeholder="Senha"
                    required
                />
                <button
                    className="p-3 bg-blue-500 text-white rounded font-bold hover:bg-blue-600 transition-colors"
                    formAction={handleLogin}
                >
                    Entrar
                </button>
                <button
                    className="p-3 bg-green-500 text-white rounded font-bold hover:bg-green-600 transition-colors"
                    formAction={handleSignUp}
                >
                    Cadastrar
                </button>
            </form>
        </div>
    );
}