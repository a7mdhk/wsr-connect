import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

function formatPosition(position: string | null) {
  if (!position) {
    return "Leadership";
  }

  const labels: Record<string, string> = {
    head_boy: "Head Boy",
    head_girl: "Head Girl",
    assistant_head_boy: "Assistant Head Boy",
    assistant_head_girl: "Assistant Head Girl",
  };

  return (
    labels[position] ??
    position
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1),
      )
      .join(" ")
  );
}

interface SectionCardProps {
  eyebrow: string;
  title: string;
  description: string;
  to: string;
}

function SectionCard({
  eyebrow,
  title,
  description,
  to,
}: SectionCardProps) {
  return (
    <NavLink
      to={to}
      style={{
        display: "block",
        padding: "24px",
        border: "1px solid #D9DDE1",
        background: "#FFFFFF",
        color: "#111111",
        textDecoration: "none",
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: "8px",
          color: "#1E5AA8",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </span>

      <h3
        style={{
          margin: "0 0 8px",
          fontSize: "20px",
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "#73777C",
          lineHeight: 1.6,
          fontSize: "14px",
        }}
      >
        {description}
      </p>

      <span
        style={{
          display: "inline-block",
          marginTop: "18px",
          color: "#1E5AA8",
          fontSize: "14px",
          fontWeight: 700,
        }}
      >
        Open →
      </span>
    </NavLink>
  );
}

export default function PortalPage() {
  const {
    user,
    position,
    signOutUser,
  } = useAuth();

  const navigate = useNavigate();

  const positionLabel =
    formatPosition(position);

  async function handleSignOut() {
    try {
      await signOutUser();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Firebase sign-out error:",
        error,
      );
    }
  }

  return (
    <main
      style={{
        background: "#F7F8F9",
        minHeight: "70vh",
        padding: "48px 20px 72px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <section
          style={{
            padding: "36px",
            background: "#123B6D",
            color: "#FFFFFF",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "24px",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#FFFFFF",
                  opacity: 0.75,
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                WSR Connect
              </span>

              <h1
                style={{
                  margin: "0 0 10px",
                  fontSize:
                    "clamp(30px, 5vw, 44px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                }}
              >
                Leadership Portal
              </h1>

              <p
                style={{
                  margin: 0,
                  maxWidth: "600px",
                  color: "#FFFFFF",
                  opacity: 0.85,
                  lineHeight: 1.6,
                }}
              >
                The private working space
                for the four senior SRC
                leaders.
              </p>
            </div>

            <div
              style={{
                minWidth: "190px",
                padding: "16px",
                border:
                  "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <span
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  opacity: 0.7,
                }}
              >
                Signed in as
              </span>

              <strong
                style={{
                  display: "block",
                  fontSize: "17px",
                }}
              >
                {positionLabel}
              </strong>

              {user?.email && (
                <span
                  style={{
                    display: "block",
                    marginTop: "5px",
                    fontSize: "12px",
                    opacity: 0.7,
                    overflowWrap: "anywhere",
                  }}
                >
                  {user.email}
                </span>
              )}
            </div>
          </div>
        </section>

        <section
          style={{
            marginTop: "24px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          <article
            style={{
              padding: "24px",
              border:
                "1px solid #D9DDE1",
              background: "#FFFFFF",
            }}
          >
            <span
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#1E5AA8",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Current week
            </span>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "22px",
              }}
            >
              No weekly priorities
              yet
            </h2>

            <p
              style={{
                margin: 0,
                color: "#73777C",
                lineHeight: 1.6,
                fontSize: "14px",
              }}
            >
              The current week's detailed
              priorities will appear here
              once the leadership team
              publishes them.
            </p>
          </article>

          <article
            style={{
              padding: "24px",
              border:
                "1px solid #D9DDE1",
              background: "#FFFFFF",
            }}
          >
            <span
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#1E5AA8",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Upcoming
            </span>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "22px",
              }}
            >
              No meetings recorded
            </h2>

            <p
              style={{
                margin: 0,
                color: "#73777C",
                lineHeight: 1.6,
                fontSize: "14px",
              }}
            >
              Leadership meetings and
              important upcoming events
              will appear here.
            </p>
          </article>

          <article
            style={{
              padding: "24px",
              border:
                "1px solid #D9DDE1",
              background: "#FFFFFF",
            }}
          >
            <span
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#1E5AA8",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Recent
            </span>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "22px",
              }}
            >
              No progress reports
              yet
            </h2>

            <p
              style={{
                margin: 0,
                color: "#73777C",
                lineHeight: 1.6,
                fontSize: "14px",
              }}
            >
              Completed weekly reports will
              appear here as the year
              progresses.
            </p>
          </article>
        </section>

        <section
          style={{
            marginTop: "48px",
          }}
        >
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <span
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#1E5AA8",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Leadership workspace
            </span>

            <h2
              style={{
                margin: 0,
                fontSize: "28px",
              }}
            >
              Quick access
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            <SectionCard
              eyebrow="Accountability"
              title="Duty Tracker"
              description="Track every SRC duty, location and assignment. Record completion or cover so no duty is left unaccounted for."
              to="/portal/duties"
            />

            <SectionCard
              eyebrow="Planning"
              title="Weekly Priorities"
              description="Review the detailed priorities and targets for the current and previous weeks."
              to="/portal/priorities"
            />

            <SectionCard
              eyebrow="Coordination"
              title="Meetings"
              description="Keep track of leadership, SLT and other important meetings."
              to="/portal/meetings"
            />

            <SectionCard
              eyebrow="Schedule"
              title="Calendar"
              description="View and manage important school, SRC, meeting and leadership events."
              to="/portal/calendar"
            />

            <SectionCard
              eyebrow="Review"
              title="Progress Reports"
              description="Review the weekly reports documenting progress, outcomes and follow-up actions."
              to="/portal/reports"
            />

            <SectionCard
              eyebrow="Feedback"
              title="Feedback Inbox"
              description="Review student feedback, requests, concerns and follow-up items submitted through WSR Connect."
              to="/portal/feedback"
            />
          </div>
        </section>

        <section
          style={{
            marginTop: "48px",
            paddingTop: "24px",
            borderTop:
              "1px solid #D9DDE1",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <NavLink
            to="/"
            style={{
              color: "#3F4348",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            ← Back to public site
          </NavLink>

          <button
            type="button"
            onClick={handleSignOut}
            style={{
              padding: "11px 16px",
              border:
                "1px solid #D9DDE1",
              background: "#FFFFFF",
              color: "#3F4348",
              font: "inherit",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </section>
      </div>
    </main>
  );
}