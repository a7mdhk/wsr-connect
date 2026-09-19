import { NavLink, Route, Routes } from "react-router";
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

function Header() {
  const navItems = [
    { label: "Home", to: "/" },
    { label: "Announcements", to: "/announcements" },
    { label: "Events", to: "/events" },
    { label: "SRC", to: "/src" },
    { label: "Resources", to: "/resources" },
    { label: "Feedback", to: "/feedback" },
  ];

  return (
    <header className="navbar">
      <div className="nav-inner">
        <NavLink className="brand" to="/">
          <div className="brand-mark">W</div>

          <div>
            <div className="brand-name">WSR Connect</div>
            <div className="brand-subtitle">
              GEMS Westminster School – RAK
            </div>
          </div>
        </NavLink>

        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <NavLink className="portal-button" to="/portal">
          School Portal →
        </NavLink>
      </div>
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
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
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
            The public side keeps everyone informed. The private School Portal
            will later provide personalised tools for students, teachers and
            school leadership.
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

          <NavLink to="/feedback" className="resource-card">
            <span>03</span>
            <strong>Feedback</strong>
            <small>Share an idea or suggestion</small>
          </NavLink>
        </div>
      </section>
    </>
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
            <article className="event-row" key={event.title}>
              <div className="event-date">
                <strong>{event.date}</strong>
                <span>{event.month}</span>
              </div>

              <div className="event-main">
                <span>{event.type}</span>
                <h3>{event.title}</h3>
              </div>

              <span className="event-arrow">→</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function SRCPage() {
  return (
    <>
      <PageHero
        eyebrow="STUDENT LEADERSHIP"
        title="Student Representative Council"
        description="A central space for understanding SRC priorities, projects, initiatives and student leadership at WSR."
      />

      <section className="section split-section">
        <div className="feature-panel">
          <span className="eyebrow">CURRENT PRIORITIES</span>

          <h2>What we're working on.</h2>

          <p>
            These priorities represent the areas currently being developed by
            student leadership.
          </p>

          <div className="priority-list">
            {priorities.map((priority, index) => (
              <div className="priority-item" key={priority}>
                <span>0{index + 1}</span>
                <strong>{priority}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="info-panel">
          <div className="info-panel-header">
            <span className="eyebrow">SRC</span>
            <span className="info-number">01</span>
          </div>

          <h3>A place for student leadership to operate.</h3>

          <p>
            The eventual private SRC workspace will contain projects, tasks,
            proposals, responsibilities, events and accountability tools.
          </p>
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
            <article className="resource-card resource-page-card" key={resource.title}>
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
            This form is currently a frontend placeholder. Later it can be
            connected to an approved school feedback system.
          </p>

          <form
            className="feedback-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <label>
              Name
              <input type="text" placeholder="Your name" />
            </label>

            <label>
              Message
              <textarea
                rows={6}
                placeholder="Share your suggestion..."
              />
            </label>

            <button className="primary-button" type="submit">
              Submit Feedback
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function PortalPage() {
  return (
    <section className="portal-page">
      <div className="portal-card">
        <span className="eyebrow">SCHOOL PORTAL</span>

        <h1>WSR Connect Portal</h1>

        <p>
          The private student, teacher and leadership portal will live here.
          Authentication and permissions will be added later.
        </p>

        <div className="portal-status">
          <strong>Coming next</strong>
          <span>School-approved authentication and role-based access.</span>
        </div>

        <NavLink className="secondary-button" to="/">
          ← Back to public site
        </NavLink>
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

export default function App() {
  return <Layout />;
}