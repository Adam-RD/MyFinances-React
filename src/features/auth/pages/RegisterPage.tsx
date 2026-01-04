import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="mx-auto max-w-md">
      <div className="card card-padding space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Crear usuario</h1>
          <p className="text-sm text-slate-600">Genera una cuenta para empezar.</p>
        </div>

        <RegisterForm />
        <p className="text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?{" "}
          <a className="font-semibold text-indigo-600 hover:text-indigo-500" href="/login">
            Iniciar sesion
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
