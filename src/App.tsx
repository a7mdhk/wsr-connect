import { useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router";
import { srcMembers } from "./data/srcMembers";
import DutiesPage from "./DutiesPage";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import LoginPage from "./auth/LoginPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import "./App.css";

const announcements = [
  {
    date: "19 Sep",
    category: "Student Leadership",
    title: "SRC priorities for the new academic year",
    text: "See the key projects and priorities the Student Representative Council is working on.",
  },
  {
    date: "18 Sep",
    category: "Events",
    title: "Upcoming school events",
    text: "Stay updated with activities, competitions, meetings and student-led events.",
  },
  {
    date: "16 Sep",
    category: "Community",
    title: "Welcome to WSR Connect",
    text: "A central place for school news, student leadership, events, resources and community updates.",
  },
];

const events = [
  {
    date: "24",
    month: "SEP",
    title: "SRC Meeting",
    type: "Leadership",
  },
  {
    date: "28",
    month: "SEP",
    title: "Student Activities Day",
    type: "Community",
  },
  {
    date: "03",
    month: "OCT",
    title: "House Event",
    type: "School Event",
  },
];

const priorities = [
  "Improve student communication",
  "Strengthen student leadership",
  "Build better common-room projects",
  "Create more student-led initiatives",
];

const srcCategories = [
  "House & Sports Leadership",
  "Innovation",
  "Sustainability",
  "Senior Prefects",
  "Prefects",
  "Events",
  "Other Leadership",
];

const seniorLeadershipOrder = [
  "Head Boy",
  "Head Girl",
  "Assistant Head Boy",
  "Assistant Head Girl",
  "Deputy Head Boy",
  "Deputy Head Girl",
];

function getSeniorMember(position: string) {
  return srcMembers.find((member) => member.position === position);
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Announcements", to: "/announcements" },
    { label: "Events", to: "/events" },
    { label: "SRC", to: "/src" },
    { label: "Duties", to: "/duties" },
    { label: "Resources", to: "/resources" },
    { label: "Feedback", to: "/feedback" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="nav-inner">
        <NavLink className="brand" to="/" onClick={closeMenu}>
          <div className="brand-mark">W</div>

          <div>
            <div className="brand-name">WSR Connect</div>
            <div className="brand-subtitle">
              GEMS Westminster School – RAK
            </div>
          </div>
        </NavLink>

        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <NavLink
            className="portal-button"
            to="/login"
            onClick={closeMenu}
          >
            SRC Login
          </NavLink>

          <button
            className="mobile-menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "mobile-nav-link active" : "mobile-nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}

          <NavLink
            to="/login"
            onClick={closeMenu}
            className="mobile-nav-link"
          >
            SRC Login
          </NavLink>
        </nav>
      ) : null}
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="brand-name">WSR Connect</div>
        <p>GEMS Westminster School – RAK</p>
      </div>

      <div className="footer-right">
        <span>School community platform</span>

        <NavLink className="portal-button" to="/portal">
          School Portal →
        </NavLink>
      </div>
    </footer>
  );
}

function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">THE WSR COMMUNITY HUB</span>

            <h1>
              One place for
              <span> school life.</span>
            </h1>

            <p>
              WSR Connect brings together school updates, student leadership,
              events, resources and community initiatives in one place.
            </p>

            <div className="hero-actions">
              <NavLink className="primary-button" to="/announcements">
                Explore WSR Connect
              </NavLink>

              <NavLink className="secondary-button" to="/src">
                Student Leadership
              </NavLink>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-top">
              <span>THIS WEEK</span>
              <span className="status-dot">● Live</span>
            </div>

            <div className="hero-card-title">
              What’s happening at WSR
            </div>

            {events.slice(0, 2).map((event) => (
              <div className="mini-event" key={event.title}>
                <div className="mini-date">
                  <strong>{event.date}</strong>
                  <span>{event.month}</span>
                </div>

                <div>
                  <strong>{event.title}</strong>
                  <p>{event.type}</p>
                </div>
              </div>
            ))}

            <div className="hero-card-footer">
              <span>3 upcoming events</span>
              <NavLink to="/events">View all →</NavLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">STAY INFORMED</span>
            <h2>Latest announcements</h2>
          </div>

          <NavLink to="/announcements" className="text-link">
            View all →
          </NavLink>
        </div>

        <div className="announcement-grid">
          {announcements.map((announcement) => (
            <article
              className="announcement-card"
              key={announcement.title}
            >
              <div className="announcement-top">
                <span>{announcement.category}</span>
                <span>{announcement.date}</span>
              </div>

              <h3>{announcement.title}</h3>

              <p>{announcement.text}</p>

              <NavLink to="/announcements" className="card-link">
                Read more →
              </NavLink>
            </article>
          ))}
        </div>
      </section>

      <section className="section split-section">
        <div className="feature-panel">
          <span className="eyebrow">STUDENT LEADERSHIP</span>

          <h2>The SRC workspace</h2>

          <p>
            A dedicated space for student leadership, projects, proposals,
            responsibilities and school initiatives.
          </p>

          <div className="priority-list">
            {priorities.map((priority, index) => (
              <div className="priority-item" key={priority}>
                <span>0{index + 1}</span>
                <strong>{priority}</strong>
              </div>
            ))}
          </div>

          <NavLink className="primary-button small-button" to="/src">
            Explore SRC
          </NavLink>
        </div>

        <div className="info-panel">
          <div className="info-panel-header">
            <span className="eyebrow">WHY WSR CONNECT?</span>
            <span className="info-number">01</span>
          </div>

          <h3>Built around the WSR community.</h3>

          <p>
            The public side keeps everyone informed. The private School
            Portal will later provide personalised tools for students,
            teachers and school leadership.
          </p>

          <div className="info-stat-grid">
            <div>
              <strong>Public</strong>
              <span>School information</span>
            </div>

            <div>
              <strong>Private</strong>
              <span>Personal tools</span>
            </div>

            <div>
              <strong>Connected</strong>
              <span>One platform</span>
            </div>

            <div>
              <strong>Student-led</strong>
              <span>Community initiatives</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">WHAT'S COMING UP</span>
            <h2>Upcoming events</h2>
          </div>

          <NavLink to="/events" className="text-link">
            Calendar →
          </NavLink>
        </div>

        <div className="events-list">
          {events.map((event) => (
            <article className="event-row" key={event.title}>
              <div className="event-date">
                <strong>{event.date}</strong>
                <span>{event.month}</span>
              </div>

              <div className="event-main">
                <span>{event.type}</span>
                <h3>{event.title}</h3>
              </div>

              <NavLink to="/events" className="event-arrow">
                →
              </NavLink>
            </article>
          ))}
        </div>
      </section>

      <section className="section resource-section">
        <div>
          <span className="eyebrow">QUICK ACCESS</span>

          <h2>Useful school resources</h2>

          <p>
            A central starting point for the information students and staff
            use most often.
          </p>
        </div>

        <div className="resource-grid">
          <NavLink to="/resources" className="resource-card">
            <span>01</span>
            <strong>School Resources</strong>
            <small>Documents and useful links</small>
          </NavLink>

          <NavLink to="/src" className="resource-card">
            <span>02</span>
            <strong>Student Leadership</strong>
            <small>SRC information and initiatives</small>
          </NavLink>

          <NavLink to="/duties" className="resource-card">
            <span>03</span>
            <strong>Duties & Timetables</strong>
            <small>SRC duty locations and schedules</small>
          </NavLink>

          <NavLink to="/feedback" className="resource-card">
            <span>04</span>
            <strong>Feedback</strong>
            <small>Share an idea or suggestion</small>
          </NavLink>
        </div>
      </section>
    </>
  );
}

function AnnouncementsPage() {
  return (
    <>
      <PageHero
        eyebrow="WSR CONNECT"
        title="Announcements"
        description="Stay up to date with school news, student leadership updates, community notices and important information."
      />

      <section className="section">
        <div className="announcement-page-grid">
          {announcements.map((announcement) => (
            <article
              className="announcement-card"
              key={announcement.title}
            >
              <div className="announcement-top">
                <span>{announcement.category}</span>
                <span>{announcement.date}</span>
              </div>

              <h3>{announcement.title}</h3>

              <p>{announcement.text}</p>

              <span className="card-link">Announcement</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="WSR CONNECT"
        title="Events"
        description="Keep track of upcoming school events, student leadership meetings and community activities."
      />

      <section className="section">
        <div className="events-list">
          {events.map((event) => (
            <article
              className="event-row event-row-static"
              key={event.title}
            >
              <div className="event-date">
                <strong>{event.date}</strong>
                <span>{event.month}</span>
              </div>

              <div className="event-main">
                <span>{event.type}</span>
                <h3>{event.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function MemberCard({
  position,
  name,
  grade,
}: {
  position: string;
  name: string;
  grade: string;
}) {
  return (
    <article className="src-member-card">
      <div className="src-member-top">
        <span className="src-member-role">{position}</span>

        <span className="src-member-grade">{grade}</span>
      </div>

      <h3>{name}</h3>

      <div className="src-member-footer">
        <span>WSR Student Leadership</span>
      </div>
    </article>
  );
}

function SRCPage() {
  const seniorLeadership = seniorLeadershipOrder
    .map((position) => getSeniorMember(position))
    .filter(
      (member): member is NonNullable<typeof member> =>
        Boolean(member),
    );

  return (
    <>
      <PageHero
        eyebrow="STUDENT LEADERSHIP"
        title="Student Representative Council"
        description="Meet the students representing and leading the WSR community across leadership, houses, innovation, sustainability, events and student leadership."
      />

      <section className="section src-intro">
        <div className="src-intro-card">
          <div>
            <span className="eyebrow">WSR SRC</span>
            <h2>Meet the student leadership team.</h2>
          </div>

          <div className="src-intro-stats">
            <div>
              <strong>{srcMembers.length}</strong>
              <span>Listed roles</span>
            </div>

            <div>
              <strong>{srcCategories.length + 1}</strong>
              <span>Leadership areas</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section src-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">HIGHEST LEADERSHIP</span>
            <h2>Senior Leadership</h2>
          </div>

          <span className="src-count">
            {seniorLeadership.length} leaders
          </span>
        </div>

        <div
          className="src-senior-leadership"
          style={{
            display: "grid",
            gap: "14px",
          }}
        >
          {[0, 1, 2].map((pairIndex) => {
            const first = seniorLeadership[pairIndex * 2];
            const second = seniorLeadership[pairIndex * 2 + 1];

            if (!first || !second) {
              return null;
            }

            return (
              <div
                key={`${first.position}-${second.position}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "14px",
                }}
              >
                <MemberCard
                  position={first.position}
                  name={first.name}
                  grade={first.grade}
                />

                <MemberCard
                  position={second.position}
                  name={second.name}
                  grade={second.grade}
                />
              </div>
            );
          })}
        </div>
      </section>

      {srcCategories.map((category) => {
        const members = srcMembers.filter(
          (member) => member.category === category,
        );

        if (members.length === 0) {
          return null;
        }

        return (
          <section className="section src-section" key={category}>
            <div className="section-heading">
              <div>
                <span className="eyebrow">SRC</span>
                <h2>{category}</h2>
              </div>

              <span className="src-count">
                {members.length}{" "}
                {members.length === 1 ? "member" : "members"}
              </span>
            </div>

            <div className="src-member-grid">
              {members.map((member) => (
                <MemberCard
                  key={`${member.position}-${member.name}`}
                  position={member.position}
                  name={member.name}
                  grade={member.grade}
                />
              ))}
            </div>
          </section>
        );
      })}

      <section className="section">
        <div className="src-contact-note">
          <span className="eyebrow">CONTACT</span>

          <h2>Need to reach student leadership?</h2>

          <p>
            Public contact details are intentionally not displayed here.
            School-approved contact channels can be added to the School Portal
            once authentication and permissions are implemented.
          </p>

          <NavLink className="secondary-button" to="/feedback">
            Send Feedback
          </NavLink>
        </div>
      </section>
    </>
  );
}

function ResourcesPage() {
  const resources = [
    {
      number: "01",
      title: "School Resources",
      description: "Useful documents and school-approved links.",
    },
    {
      number: "02",
      title: "Student Leadership",
      description: "Information relating to student leadership and SRC work.",
    },
    {
      number: "03",
      title: "School Information",
      description: "Public-facing information for the WSR community.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="WSR CONNECT"
        title="Resources"
        description="A central location for useful school information, documents and links."
      />

      <section className="section">
        <div className="resource-page-grid">
          {resources.map((resource) => (
            <article
              className="resource-card resource-page-card"
              key={resource.title}
            >
              <span>{resource.number}</span>
              <strong>{resource.title}</strong>
              <small>{resource.description}</small>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function FeedbackPage() {
  return (
    <>
      <PageHero
        eyebrow="YOUR VOICE MATTERS"
        title="Feedback"
        description="Have an idea, suggestion or concern about the student community? This is the starting point for sharing it."
      />

      <section className="section">
        <div className="feedback-panel">
          <span className="eyebrow">PUBLIC FEEDBACK</span>

          <h2>Tell us what could be better.</h2>

          <p>
            The public feedback system is not connected yet. We are keeping
            submissions disabled until an approved school feedback channel is
            in place.
          </p>

          <div className="feedback-status">
            <div className="feedback-status-marker" aria-hidden="true">
              i
            </div>

            <div>
              <strong>Feedback submissions are coming soon.</strong>

              <p>
                Nothing entered on this page is currently collected or sent
                anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PortalPage() {
  const { signOutUser } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await signOutUser();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Firebase sign-out error:", error);
      setSigningOut(false);
    }
  }

  return (
    <section className="portal-page">
      <div className="portal-card">
        <span className="eyebrow">SCHOOL PORTAL</span>

        <h1>WSR Connect Portal</h1>

        <p>
          You are signed in. This private portal will contain approved
          student, teacher and leadership tools.
        </p>

        <div className="portal-status">
          <strong>Authentication active</strong>
          <span>
            SRC-specific authorization and private portal features will be
            added next.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "24px",
          }}
        >
          <NavLink className="secondary-button" to="/">
            ← Back to public site
          </NavLink>

          <button
            type="button"
            className="secondary-button"
            onClick={handleSignOut}
            disabled={signingOut}
            style={{
              cursor: signingOut ? "wait" : "pointer",
              opacity: signingOut ? 0.7 : 1,
            }}
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="portal-page">
      <div className="portal-card">
        <span className="eyebrow">404</span>

        <h1>Page not found.</h1>

        <p>
          The page you're looking for doesn't exist in WSR Connect.
        </p>

        <NavLink className="primary-button" to="/">
          Return home
        </NavLink>
      </div>
    </section>
  );
}

function Layout() {
  return (
    <div className="app">
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/announcements"
            element={<AnnouncementsPage />}
          />

          <Route path="/events" element={<EventsPage />} />

          <Route path="/src" element={<SRCPage />} />

          <Route path="/duties" element={<DutiesPage />} />

          <Route path="/resources" element={<ResourcesPage />} />

          <Route path="/feedback" element={<FeedbackPage />} />

          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <PortalPage />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<LoginPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}