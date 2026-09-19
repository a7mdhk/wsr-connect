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
    text: "A central place for school news, student life, initiatives, resources and community updates.",
  },
];

const events = [
  { date: "24", month: "SEP", title: "SRC Meeting", type: "Leadership" },
  { date: "28", month: "SEP", title: "Student Activities Day", type: "Community" },
  { date: "03", month: "OCT", title: "House Event", type: "School Event" },
];

const priorities = [
  "Improve student communication",
  "Strengthen student leadership",
  "Build better common-room projects",
  "Create more student-led initiatives",
];

export default function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="nav-inner">
          <a className="brand" href="#">
            <div className="brand-mark">W</div>
            <div>
              <div className="brand-name">WSR Connect</div>
              <div className="brand-subtitle">GEMS Westminster School – RAK</div>
            </div>
          </a>

          <nav className="nav-links">
            <a href="#announcements">Announcements</a>
            <a href="#events">Events</a>
            <a href="#src">SRC</a>
            <a href="#resources">Resources</a>
          </nav>

          <button className="portal-button">School Portal →</button>
        </div>
      </header>

      <main>
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
                <a className="primary-button" href="#announcements">
                  Explore WSR Connect
                </a>
                <a className="secondary-button" href="#src">
                  Student Leadership
                </a>
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

              <div className="mini-event">
                <div className="mini-date">
                  <strong>24</strong>
                  <span>SEP</span>
                </div>
                <div>
                  <strong>SRC Meeting</strong>
                  <p>Student leadership</p>
                </div>
              </div>

              <div className="mini-event">
                <div className="mini-date">
                  <strong>28</strong>
                  <span>SEP</span>
                </div>
                <div>
                  <strong>Student Activities Day</strong>
                  <p>School community</p>
                </div>
              </div>

              <div className="hero-card-footer">
                <span>3 upcoming events</span>
                <a href="#events">View all →</a>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="announcements">
          <div className="section-heading">
            <div>
              <span className="eyebrow">STAY INFORMED</span>
              <h2>Latest announcements</h2>
            </div>
            <a href="#" className="text-link">
              View all →
            </a>
          </div>

          <div className="announcement-grid">
            {announcements.map((announcement) => (
              <article className="announcement-card" key={announcement.title}>
                <div className="announcement-top">
                  <span>{announcement.category}</span>
                  <span>{announcement.date}</span>
                </div>
                <h3>{announcement.title}</h3>
                <p>{announcement.text}</p>
                <a href="#" className="card-link">
                  Read more →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="section split-section" id="src">
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

            <a href="#" className="primary-button small-button">
              Explore SRC
            </a>
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

        <section className="section" id="events">
          <div className="section-heading">
            <div>
              <span className="eyebrow">WHAT'S COMING UP</span>
              <h2>Upcoming events</h2>
            </div>
            <a href="#" className="text-link">
              Calendar →
            </a>
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

                <a href="#" className="event-arrow">
                  →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="section resource-section" id="resources">
          <div>
            <span className="eyebrow">QUICK ACCESS</span>
            <h2>Useful school resources</h2>
            <p>
              A central starting point for the information students and staff
              use most often.
            </p>
          </div>

          <div className="resource-grid">
            <a href="#" className="resource-card">
              <span>01</span>
              <strong>School Resources</strong>
              <small>Documents and useful links</small>
            </a>

            <a href="#" className="resource-card">
              <span>02</span>
              <strong>Student Life</strong>
              <small>Clubs, activities and initiatives</small>
            </a>

            <a href="#" className="resource-card">
              <span>03</span>
              <strong>Feedback</strong>
              <small>Share an idea or suggestion</small>
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <div className="brand-name">WSR Connect</div>
          <p>GEMS Westminster School – RAK</p>
        </div>

        <div className="footer-right">
          <span>School community platform</span>
          <button className="portal-button">School Portal →</button>
        </div>
      </footer>
    </div>
  );
}