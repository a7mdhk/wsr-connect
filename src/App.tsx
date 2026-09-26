import DutyTrackerPage from "./portal/DutyTrackerPage";
import PortalPage from "./portal/PortalPage";
import CalendarPage from "./portal/CalendarPage";
import FeedbackInboxPage from "./portal/FeedbackInboxPage";
import { useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router";
import { srcMembers } from "./data/srcMembers";
import DutiesPage from "./DutiesPage";
import { AuthProvider } from "./auth/AuthContext";
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

const feedbackAllowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const feedbackMaxFileSize = 50 * 1024 * 1024;
const feedbackMaxFiles = 10;

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
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">
              {menuOpen ? "×" : "☰"}
            </span>
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
                isActive
                  ? "mobile-nav-link active"
                  : "mobile-nav-link"
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
  const location = useLocation();

  const isPortalRoute =
    location.pathname === "/portal" ||
    location.pathname.startsWith("/portal/");

  return (
    <footer className="footer">
      <div>
        <div className="brand-name">WSR Connect</div>
        <p>GEMS Westminster School – RAK</p>
      </div>

      <div className="footer-right">
        <span>School community platform</span>

        {!isPortalRoute && (
          <NavLink className="portal-button" to="/portal">
            School Portal →
          </NavLink>
        )}
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
              WSR Connect brings together school updates, student
              leadership, events, resources and community initiatives in one
              place.
            </p>

            <div className="hero-actions">
              <NavLink
                className="primary-button"
                to="/announcements"
              >
                Explore WSR Connect
              </NavLink>

              <NavLink
                className="secondary-button"
                to="/src"
              >
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
              <div
                className="mini-event"
                key={event.title}
              >
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

          <NavLink
            to="/announcements"
            className="text-link"
          >
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

              <NavLink
                to="/announcements"
                className="card-link"
              >
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
              <div
                className="priority-item"
                key={priority}
              >
                <span>0{index + 1}</span>
                <strong>{priority}</strong>
              </div>
            ))}
          </div>

          <NavLink
            className="primary-button small-button"
            to="/src"
          >
            Explore SRC
          </NavLink>
        </div>

        <div className="info-panel">
          <div className="info-panel-header">
            <span className="eyebrow">
              WHY WSR CONNECT?
            </span>
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

          <NavLink
            to="/events"
            className="text-link"
          >
            Calendar →
          </NavLink>
        </div>

        <div className="events-list">
          {events.map((event) => (
            <article
              className="event-row"
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

              <NavLink
                to="/events"
                className="event-arrow"
              >
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
          <NavLink
            to="/resources"
            className="resource-card"
          >
            <span>01</span>
            <strong>School Resources</strong>
            <small>Documents and useful links</small>
          </NavLink>

          <NavLink
            to="/src"
            className="resource-card"
          >
            <span>02</span>
            <strong>Student Leadership</strong>
            <small>SRC information and initiatives</small>
          </NavLink>

          <NavLink
            to="/duties"
            className="resource-card"
          >
            <span>03</span>
            <strong>Duties & Timetables</strong>
            <small>SRC duty locations and schedules</small>
          </NavLink>

          <NavLink
            to="/feedback"
            className="resource-card"
          >
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

              <span className="card-link">
                Announcement
              </span>
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
        <span className="src-member-role">
          {position}
        </span>

        <span className="src-member-grade">
          {grade}
        </span>
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
            <h2>
              Meet the student leadership team.
            </h2>
          </div>

          <div className="src-intro-stats">
            <div>
              <strong>{srcMembers.length}</strong>
              <span>Listed roles</span>
            </div>

            <div>
              <strong>
                {srcCategories.length + 1}
              </strong>
              <span>Leadership areas</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section src-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              HIGHEST LEADERSHIP
            </span>
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
            const first =
              seniorLeadership[pairIndex * 2];
            const second =
              seniorLeadership[pairIndex * 2 + 1];

            if (!first || !second) {
              return null;
            }

            return (
              <div
                key={`${first.position}-${second.position}`}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
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
          <section
            className="section src-section"
            key={category}
          >
            <div className="section-heading">
              <div>
                <span className="eyebrow">SRC</span>
                <h2>{category}</h2>
              </div>

              <span className="src-count">
                {members.length}{" "}
                {members.length === 1
                  ? "member"
                  : "members"}
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

          <h2>
            Need to reach student leadership?
          </h2>

          <p>
            Public contact details are intentionally not displayed here.
            School-approved contact channels can be added to the School Portal
            once authentication and permissions are implemented.
          </p>

          <NavLink
            className="secondary-button"
            to="/feedback"
          >
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
      description:
        "Useful documents and school-approved links.",
    },
    {
      number: "02",
      title: "Student Leadership",
      description:
        "Information relating to student leadership and SRC work.",
    },
    {
      number: "03",
      title: "School Information",
      description:
        "Public-facing information for the WSR community.",
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
  const [fullName, setFullName] = useState("");
  const [gradeSection, setGradeSection] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [requestResponse, setRequestResponse] =
    useState(false);
  const [
    requestStaffInvolvement,
    setRequestStaffInvolvement,
  ] = useState(false);

  const [attachments, setAttachments] =
    useState<File[]>([]);

  const [submitting, setSubmitting] =
    useState(false);
  const [submitted, setSubmitted] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const handleFileSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setErrorMessage("");

    const selectedFiles = Array.from(
      event.target.files ?? [],
    );

    if (selectedFiles.length === 0) {
      return;
    }

    const combinedFiles = [
      ...attachments,
      ...selectedFiles,
    ];

    if (
      combinedFiles.length > feedbackMaxFiles
    ) {
      setErrorMessage(
        `You can attach up to ${feedbackMaxFiles} files.`,
      );

      event.target.value = "";
      return;
    }

    for (const file of selectedFiles) {
      if (file.size > feedbackMaxFileSize) {
        setErrorMessage(
          `"${file.name}" is larger than the 50 MB limit.`,
        );

        event.target.value = "";
        return;
      }

      if (
        file.type &&
        !feedbackAllowedMimeTypes.includes(file.type)
      ) {
        setErrorMessage(
          `"${file.name}" has an unsupported file type.`,
        );

        event.target.value = "";
        return;
      }
    }

    setAttachments(combinedFiles);

    event.target.value = "";
  };

  const removeAttachment = (
    indexToRemove: number,
  ) => {
    setAttachments((currentFiles) =>
      currentFiles.filter(
        (_, index) => index !== indexToRemove,
      ),
    );

    setErrorMessage("");
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(
      size /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSubmitting(true);
    setSubmitted(false);
    setErrorMessage("");

    try {
      if (
        attachments.length > feedbackMaxFiles
      ) {
        throw new Error(
          `You can attach up to ${feedbackMaxFiles} files.`,
        );
      }

      for (const file of attachments) {
        if (file.size > feedbackMaxFileSize) {
          throw new Error(
            `"${file.name}" is larger than the 50 MB limit.`,
          );
        }

        if (
          file.type &&
          !feedbackAllowedMimeTypes.includes(file.type)
        ) {
          throw new Error(
            `"${file.name}" has an unsupported file type.`,
          );
        }
      }

      const formData = new FormData();

      formData.append("full_name", fullName);
      formData.append(
        "grade_section",
        gradeSection,
      );
      formData.append("email", email || "");
      formData.append("category", category);
      formData.append("subject", subject);
      formData.append("message", message);

      formData.append(
        "request_response",
        String(requestResponse),
      );

      formData.append(
        "request_staff_involvement",
        String(requestStaffInvolvement),
      );

      for (const file of attachments) {
        formData.append(
          "attachments",
          file,
          file.name,
        );
      }

      const response = await fetch(
        "https://kulmkrqoadsoaocuovpe.supabase.co/functions/v1/submit-feedback",
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Something went wrong while submitting your feedback.",
        );
      }

      setSubmitted(true);
      setFullName("");
      setGradeSection("");
      setEmail("");
      setCategory("");
      setSubject("");
      setMessage("");
      setRequestResponse(false);
      setRequestStaffInvolvement(false);
      setAttachments([]);
    } catch (error) {
      console.error(
        "Feedback submission failed:",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your feedback.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="YOUR VOICE MATTERS"
        title="Feedback"
        description="Share an idea, concern, report or suggestion with student leadership."
      />

      <section className="section">
        <div className="feedback-panel">
          <span className="eyebrow">
            PUBLIC FEEDBACK
          </span>

          <h2>Tell us what could be better.</h2>

          <p>
            Your feedback will be submitted to the WSR Connect feedback
            system for review by the authorised student leadership team.
          </p>

          {submitted ? (
            <div className="feedback-status">
              <div
                className="feedback-status-marker"
                aria-hidden="true"
              >
                ✓
              </div>

              <div>
                <strong>
                  Feedback submitted successfully.
                </strong>

                <p>
                  Thank you. Your submission has been received and can now
                  be reviewed by the authorised leadership team.
                </p>

                <button
                  className="secondary-button"
                  type="button"
                  onClick={() =>
                    setSubmitted(false)
                  }
                >
                  Submit another response
                </button>
              </div>
            </div>
          ) : (
            <form
              className="feedback-form"
              onSubmit={handleSubmit}
            >
              <div className="feedback-form-grid">
                <label>
                  <span>Full Name *</span>

                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(
                        event.target.value,
                      )
                    }
                    placeholder="Your full name"
                    maxLength={120}
                    required
                  />
                </label>

                <label>
                  <span>Grade & Section *</span>

                  <input
                    type="text"
                    value={gradeSection}
                    onChange={(event) =>
                      setGradeSection(
                        event.target.value,
                      )
                    }
                    placeholder="e.g. Year 12A"
                    maxLength={80}
                    required
                  />
                </label>
              </div>

              <label>
                <span>Email Address</span>

                <small>
                  Optional. Provide this if you would like a response.
                </small>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="your.email@example.com"
                  maxLength={254}
                />
              </label>

              <label>
                <span>What is this about? *</span>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value,
                    )
                  }
                  required
                >
                  <option
                    value=""
                    disabled
                  >
                    Select a category
                  </option>

                  <option value="suggestion">
                    Suggestion / Idea
                  </option>

                  <option value="concern">
                    Concern
                  </option>

                  <option value="event">
                    Event
                  </option>

                  <option value="facilities">
                    Facilities
                  </option>

                  <option value="src">
                    SRC / Student Leadership
                  </option>

                  <option value="website">
                    WSR Connect / Website
                  </option>

                  <option value="report">
                    Report an Incident
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </label>

              <label>
                <span>Subject *</span>

                <input
                  type="text"
                  value={subject}
                  onChange={(event) =>
                    setSubject(
                      event.target.value,
                    )
                  }
                  placeholder="Briefly describe what your feedback is about"
                  maxLength={200}
                  required
                />
              </label>

              <label>
                <span>Feedback *</span>

                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target.value,
                    )
                  }
                  placeholder="Explain your feedback, concern or report..."
                  maxLength={5000}
                  rows={7}
                  required
                />
              </label>

              <div className="feedback-attachments">
                <div>
                  <span className="feedback-field-label">
                    Attachments
                  </span>

                  <small>
                    Optional. You can attach up to 10 files, with a
                    maximum of 50 MB per file.
                  </small>
                </div>

                <label className="feedback-file-input">
                  <span>Select files</span>

                  <input
                    type="file"
                    multiple
                    accept={[
                      ".jpg",
                      ".jpeg",
                      ".png",
                      ".webp",
                      ".gif",
                      ".pdf",
                      ".txt",
                      ".doc",
                      ".docx",
                      ".xls",
                      ".xlsx",
                      ".ppt",
                      ".pptx",
                    ].join(",")}
                    onChange={
                      handleFileSelection
                    }
                    disabled={
                      submitting ||
                      attachments.length >=
                        feedbackMaxFiles
                    }
                  />
                </label>

                {attachments.length > 0 ? (
                  <div className="feedback-file-list">
                    {attachments.map(
                      (file, index) => (
                        <div
                          className="feedback-file-item"
                          key={`${file.name}-${file.size}-${index}`}
                        >
                          <div>
                            <strong>
                              {file.name}
                            </strong>

                            <small>
                              {formatFileSize(
                                file.size,
                              )}
                            </small>
                          </div>

                          <button
                            type="button"
                            className="feedback-file-remove"
                            onClick={() =>
                              removeAttachment(
                                index,
                              )
                            }
                            disabled={submitting}
                            aria-label={`Remove ${file.name}`}
                          >
                            Remove
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                ) : null}
              </div>

              <div className="feedback-options">
                <label className="feedback-checkbox">
                  <input
                    type="checkbox"
                    checked={requestResponse}
                    onChange={(event) =>
                      setRequestResponse(
                        event.target.checked,
                      )
                    }
                  />

                  <span>
                    <strong>
                      I would like a response.
                    </strong>

                    <small>
                      If selected, please provide an email address above.
                    </small>
                  </span>
                </label>

                <label className="feedback-checkbox">
                  <input
                    type="checkbox"
                    checked={
                      requestStaffInvolvement
                    }
                    onChange={(event) =>
                      setRequestStaffInvolvement(
                        event.target.checked,
                      )
                    }
                  />

                  <span>
                    <strong>
                      I would like a staff member to be involved.
                    </strong>

                    <small>
                      Select this if you would like your concern to be
                      referred for staff involvement.
                    </small>
                  </span>
                </label>
              </div>

              <div className="feedback-privacy">
                <strong>Before you submit</strong>

                <p>
                  Please avoid sharing passwords, account credentials or
                  other highly sensitive information. This feedback system
                  is intended for school-community suggestions, concerns,
                  reports and requests. Submissions are accessible only to
                  authorised members of the WSR Connect leadership system.
                </p>

                <p>
                  This notice is temporary and does not represent a
                  school-approved privacy policy.
                </p>
              </div>

              {errorMessage ? (
                <div
                  className="feedback-error"
                  role="alert"
                >
                  {errorMessage}
                </div>
              ) : null}

              <button
                className="primary-button"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Feedback"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
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

        <NavLink
          className="primary-button"
          to="/"
        >
          Return home
        </NavLink>
      </div>
    </section>
  );
}

function PortalNotFoundPage() {
  return (
    <section className="portal-page">
      <div className="portal-card">
        <span className="eyebrow">
          404 · LEADERSHIP PORTAL
        </span>

        <h1>Portal page not found.</h1>

        <p>
          This leadership portal page doesn't exist yet or the address is
          incorrect.
        </p>

        <NavLink
          className="primary-button"
          to="/portal"
        >
          Back to Portal
        </NavLink>
      </div>
    </section>
  );
}

function Layout() {
  const location = useLocation();

  const isPortalRoute =
    location.pathname === "/portal" ||
    location.pathname.startsWith("/portal/");

  return (
    <div className="app">
      <Header />

      <main>
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/announcements"
            element={<AnnouncementsPage />}
          />

          <Route
            path="/events"
            element={<EventsPage />}
          />

          <Route
            path="/src"
            element={<SRCPage />}
          />

          <Route
            path="/duties"
            element={
              <ProtectedRoute requiredAccess="src">
                <DutiesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resources"
            element={<ResourcesPage />}
          />

          <Route
            path="/feedback"
            element={<FeedbackPage />}
          />

          <Route
            path="/portal"
            element={
              <ProtectedRoute requiredAccess="leadership">
                <PortalPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portal/calendar"
            element={
              <ProtectedRoute requiredAccess="leadership">
                <CalendarPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portal/duties"
            element={
              <ProtectedRoute requiredAccess="leadership">
                <DutyTrackerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portal/feedback"
            element={
              <ProtectedRoute requiredAccess="leadership">
                <FeedbackInboxPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portal/*"
            element={
              <ProtectedRoute requiredAccess="leadership">
                <PortalNotFoundPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="*"
            element={
              isPortalRoute ? (
                <ProtectedRoute requiredAccess="leadership">
                  <PortalNotFoundPage />
                </ProtectedRoute>
              ) : (
                <NotFoundPage />
              )
            }
          />
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