import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProviderSummary = {
  display_name: string;
  service_category: string;
};

function getProviderSummary(value: unknown): ProviderSummary | null {
  const provider = Array.isArray(value) ? value[0] : value;

  if (!provider || typeof provider !== "object") {
    return null;
  }

  const record = provider as {
    display_name?: unknown;
    service_category?: unknown;
  };

  return {
    display_name:
      typeof record.display_name === "string"
        ? record.display_name
        : "HomeHelp professional",
    service_category:
      typeof record.service_category === "string"
        ? record.service_category
        : "",
  };
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const bookings = user
    ? (
        await supabase
          .from("bookings")
          .select(
            "id, starts_at, total, status, provider_profiles(display_name, service_category)"
          )
          .eq("customer_id", user.id)
          .order("starts_at", { ascending: true })
      ).data ?? []
    : [];

  return (
    <main>
      <div className="shell">
        <div className="nav">
          <Link className="brand" href="/">
            <span className="mark">·</span>
            homehelp
          </Link>

          <div className="nav-actions">
            <Link className="btn btn-secondary" href="/">
              Browse helpers
            </Link>
            <Link className="btn btn-primary" href="/provider/onboarding">
              Offer services
            </Link>
          </div>
        </div>

        <section className="section">
          <div className="kicker">Your HomeHelp</div>

          <h1
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              marginTop: 14,
            }}
          >
            Bookings.
          </h1>

          <p className="lead" style={{ fontSize: 17 }}>
            {user
              ? `Signed in as ${user.email}`
              : "Sign in to view your bookings and requests."}
          </p>

          {!user ? (
            <Link className="btn btn-primary" href="/auth" style={{ marginTop: 24 }}>
              Sign in
            </Link>
          ) : (
            <div
              className="card"
              style={{ marginTop: 30, overflow: "hidden" }}
            >
              {bookings.length ? (
                bookings.map((booking) => {
                  const provider = getProviderSummary(
                    booking.provider_profiles
                  );

                  return (
                    <div
                      key={booking.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 20,
                        padding: 18,
                        borderBottom: "1px solid var(--line)",
                      }}
                    >
                      <div>
                        <strong>
                          {provider?.display_name ?? "HomeHelp professional"}
                        </strong>

                        <div className="provider-role">
                          {new Date(booking.starts_at).toLocaleString("en-NL")}
                          {" · "}
                          {provider?.service_category ?? ""}
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <strong>€{booking.total}</strong>
                        <div className="provider-role">
                          {booking.status}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: 22, color: "var(--muted)" }}>
                  No bookings yet.{" "}
                  <Link className="link" href="/#find-help">
                    Find a helper →
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
