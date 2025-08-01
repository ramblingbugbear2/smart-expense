// src/pages/HomePage.jsx
import { Link } from "react-router-dom";
import { HandCoins, Users, ShieldCheck } from "lucide-react";
import hero from "@/assets/hero.svg";
import { useAuth } from "@/hooks/useAuth";

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="flex flex-col items-center text-center space-y-3">
      <Icon className="w-10 h-10 text-sky-600" />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}

export default function HomePage() {
  const { access, set } = useAuth();          // access → token, set(null) → logout

  return (
    <div className="min-h-screen flex flex-col">
      {/* ───────── Nav ───────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl text-sky-600">
            SmartExpense
          </Link>

          {access ? (
            /* logged-IN → just sign-out */
            <button
              onClick={() => {
                set(null);
                window.location.href = "/";
              }}
              className="rounded-lg bg-red-600 text-white px-4 py-1.5 hover:bg-red-700"
            >
              Sign&nbsp;out
            </button>
          ) : (
            /* logged-OUT → Login & Sign-up */
            <div className="flex gap-4">
              <Link to="/login" className="text-sky-600 hover:text-sky-700">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-sky-600 text-white px-4 py-1.5 hover:bg-sky-700"
              >
                Sign&nbsp;Up
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* ───────── Hero ───────── */}
      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-4 py-24 grid lg:grid-cols-2 gap-16 place-items-center">
          {/* left: text + CTA */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Split expenses&nbsp;
              <span className="text-sky-600">without the headache</span>.
            </h1>

            <p className="text-lg text-gray-600 max-w-prose">
              Track who paid what, see who owes whom, and settle up in one tap.
              Ideal for trips, flat-shares and group projects.
            </p>

            {/* CTA buttons */}
            {access ? (
              /* logged-IN → single button */
              <Link
                to="/app"
                className="inline-block px-8 py-4 rounded-lg bg-sky-600 text-white
                 font-medium shadow hover:bg-sky-700 transition"
              >
                Go&nbsp;to&nbsp;Workspace
              </Link>
            ) : (
              /* logged-OUT → two buttons */
              <div className="flex gap-4 flex-wrap">
                <Link
                  to="/signup"
                  className="px-6 py-3 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700"
                >
                  Get&nbsp;Started&nbsp;–&nbsp;It’s&nbsp;Free
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-lg border border-sky-600 text-sky-600 hover:bg-sky-50"
                >
                  Demo&nbsp;Workspace
                </Link>
              </div>
            )}
          </div>

          {/* right: illustration */}
          <img
            src={hero}
            alt=""
            className="w-full max-w-md mx-auto drop-shadow-xl select-none pointer-events-none"
          />
        </section>

        {/* ───────── Feature blocks ───────── */}
        <section className="bg-secondary/50 py-20">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-10">
            <Feature
              icon={HandCoins}
              title="Instant settles"
              text="One tap creates matching records for everyone."
            />
            <Feature
              icon={Users}
              title="Unlimited groups"
              text="Trips, projects or flat-shares — organise as you like."
            />
            <Feature
              icon={ShieldCheck}
              title="Secure & private"
              text="Only your group can view amounts and notes."
            />
          </div>
        </section>
      </main>

      {/* ───────── Footer ───────── */}
      <footer className="py-6 border-t text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SmartExpense
      </footer>
    </div>
  );
}
