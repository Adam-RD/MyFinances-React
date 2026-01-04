import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="relative min-h-[75vh] overflow-hidden rounded-3xl bg-linear-to-br from-indigo-50 via-white to-emerald-50 p-6 shadow-inner">
      <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-0 h-36 w-36 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-center">
        <div className="space-y-4 lg:w-1/2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
            Acceso seguro
          </span>
          <h1 className="text-3xl font-bold text-slate-900">Inicia sesion y retoma tus finanzas</h1>
          <p className="text-sm text-slate-600">
            Controla ingresos, gastos y ahorros desde un panel claro, elige tu moneda favorita y mantente al dia.
          </p>
          <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-500 to-emerald-500 opacity-80 blur-md" />
            <p className="text-xs text-slate-500">
              Mantente autenticado para ver tu balance y movimientos recientes al instante.
            </p>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="card card-padding space-y-6 shadow-xl shadow-indigo-100">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-slate-900">Bienvenido de vuelta</h2>
              <p className="text-sm text-slate-600">Ingresa tus datos para acceder.</p>
            </div>

            <LoginForm />
            <p className="text-center text-sm text-slate-600">
              No tienes cuenta?{" "}
              <a className="font-semibold text-indigo-600 hover:text-indigo-500" href="/register">
                Crear cuenta
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
