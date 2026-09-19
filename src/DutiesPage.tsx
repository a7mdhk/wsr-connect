import { useMemo, useState, type ReactNode } from "react";
import "./Duties.css";
import "./DutyFinder.css";
import {
  approvedVolunteers,
  breakPeriods,
  corridorDutyLocations,
  corridorDutyRole,
  coverageInstructions,
  dutyDataStatus,
  downstairsBreakDuties,
  fridayTransitionTimes,
  schoolDays,
  transitionDutyLocations,
  transitionDutyRole,
  transitionDutyTimes,
  upstairsBreakDuties,
  type BreakPeriod,
  type SchoolDay,
} from "./data/duties";

type DutySection = "breaks" | "transition" | "corridor";
type BreakArea = "downstairs" | "upstairs";
type Gender = "girls" | "boys";

const dayShortLabels: Record<SchoolDay, string> = {
  Monday: "MON",
  Tuesday: "TUE",
  Wednesday: "WED",
  Thursday: "THU",
  Friday: "FRI",
};

function PageHeading() {
  return (
    <section className="duties-hero">
      <div className="duties-hero-inner">
        <span className="eyebrow">SRC DUTY ROTATIONS</span>

        <h1>
          Duties,
          <span> schedules & timetables.</span>
        </h1>

        <p>
          The public duty directory for SRC break coverage, transition duty
          and corridor duty at WSR.
        </p>

        <div className="duties-hero-meta">
          <span>2027 SRC Duty Rotations</span>
          <span>Public schedule</span>
        </div>
      </div>
    </section>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={active ? "duty-tab active" : "duty-tab"}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function AssignmentList({
  people,
  emptyLabel = "Unassigned",
}: {
  people: string[];
  emptyLabel?: string;
}) {
  if (people.length === 0) {
    return <span className="unassigned">{emptyLabel}</span>;
  }

  return (
    <div className="assignment-list">
      {people.map((person) => (
        <span className="assignment-chip" key={person}>
          {person}
        </span>
      ))}
    </div>
  );
}

function BreakSchedule({
  area,
  period,
}: {
  area: BreakArea;
  period: BreakPeriod;
}) {
  const posts =
    area === "downstairs"
      ? downstairsBreakDuties[period]
      : upstairsBreakDuties[period];

  const scheduledDays: readonly SchoolDay[] =
    area === "downstairs" ? schoolDays.slice(0, 4) : schoolDays;

  return (
    <div className="duty-table-shell">
      <div className="duty-table-scroll">
        <table className="duty-table">
          <thead>
            <tr>
              <th className="location-column">Duty Location</th>

              {schoolDays.map((day) => (
                <th key={day}>
                  <span>{dayShortLabels[day]}</span>
                  <small>
                    {scheduledDays.includes(day) ? period : "Not listed"}
                  </small>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {posts.map((post, index) => (
              <tr key={`${post.location}-${index}`}>
                <td className="duty-location-cell">
                  <strong>{post.location}</strong>

                  {post.role ? (
                    <span className="duty-role">{post.role}</span>
                  ) : null}
                </td>

                {schoolDays.map((day) => (
                  <td key={day}>
                    {post.assignments[day] ? (
                      <AssignmentList
                        people={post.assignments[day] ?? []}
                      />
                    ) : (
                      <span className="not-listed">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface DutyFinderResult {
  area: "Downstairs" | "Upstairs";
  period: BreakPeriod;
  location: string;
  role?: string;
  matchedPeople: string[];
  days: SchoolDay[];
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function formatDayRange(days: SchoolDay[]) {
  if (days.length === 0) {
    return "";
  }

  if (days.length === 5) {
    return "Monday–Friday";
  }

  if (
    days.length === 4 &&
    days.every((day, index) => day === schoolDays[index])
  ) {
    return "Monday–Thursday";
  }

  return days.join(", ");
}

function findBreakDuties(query: string): DutyFinderResult[] {
  const normalizedQuery = normalizeSearch(query);

  if (!normalizedQuery) {
    return [];
  }

  const schedules = [
    {
      area: "Downstairs" as const,
      data: downstairsBreakDuties,
    },
    {
      area: "Upstairs" as const,
      data: upstairsBreakDuties,
    },
  ];

  const results: DutyFinderResult[] = [];

  for (const schedule of schedules) {
    for (const period of breakPeriods) {
      const posts = schedule.data[period];

      for (const post of posts) {
        const days = schoolDays.filter((day) =>
          (post.assignments[day] ?? []).some((person) =>
            normalizeSearch(person).includes(normalizedQuery),
          ),
        );

        if (days.length === 0) {
          continue;
        }

        const matchedPeople = Array.from(
          new Set(
            days.flatMap((day) =>
              post.assignments[day]?.filter((person) =>
                normalizeSearch(person).includes(normalizedQuery),
              ) ?? [],
            ),
          ),
        );

        results.push({
          area: schedule.area,
          period,
          location: post.location,
          role: post.role,
          matchedPeople,
          days,
        });
      }
    }
  }

  return results;
}

function DutyFinder() {
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => findBreakDuties(query),
    [query],
  );

  return (
    <section className="duty-finder">
      <div className="duty-finder-heading">
        <div>
          <span className="eyebrow">FIND YOUR DUTY</span>
          <h2>Looking for your assignment?</h2>
        </div>

        <span className="duty-finder-label">Break duty roster</span>
      </div>

      <div className="duty-finder-search">
        <input
          aria-label="Search duty assignment"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search your name or published duty name..."
        />

        <span>⌕</span>
      </div>

      {!query.trim() ? (
        <div className="duty-finder-empty">
          <strong>Search the published roster.</strong>
          <span>
            Try a name such as Ibrahim, Devanshi, Hamzah (V), M.H or
            Zaheen.
          </span>
        </div>
      ) : results.length === 0 ? (
        <div className="duty-finder-empty">
          <strong>No published break-duty match.</strong>
          <span>
            Check the spelling or search using the name exactly as it
            appears in the duty schedule.
          </span>
        </div>
      ) : (
        <div className="duty-finder-results">
          {results.map((result, index) => (
            <article
              className="duty-finder-result"
              key={`${result.area}-${result.period}-${result.location}-${index}`}
            >
              <div className="duty-finder-result-top">
                <div>
                  {result.matchedPeople.map((person) => (
                    <span
                      className="assignment-chip"
                      key={person}
                    >
                      {person}
                    </span>
                  ))}
                </div>

                <span className="duty-finder-area">
                  {result.area}
                </span>
              </div>

              <div className="duty-finder-result-main">
                <strong>{result.location}</strong>
                <span>
                  {result.period} · {formatDayRange(result.days)}
                </span>
              </div>

              {result.role ? (
                <p>{result.role}</p>
              ) : null}
            </article>
          ))}
        </div>
      )}

      <p className="duty-finder-note">
        The finder searches the names exactly as they appear in the supplied
        2027 SRC Duty Rotations schedule.
      </p>
    </section>
  );
}

function ApprovedVolunteers() {
  return (
    <section className="duty-support-section">
      <div className="duty-section-heading">
        <div>
          <span className="eyebrow">ABSENCE COVER</span>
          <h2>Approved volunteers</h2>
        </div>
      </div>

      <div className="volunteer-grid">
        <div className="volunteer-card">
          <span className="volunteer-label">GIRLS (V)</span>

          <div className="volunteer-list">
            {approvedVolunteers.girls.map((person) => (
              <span key={person}>{person}</span>
            ))}
          </div>
        </div>

        <div className="volunteer-card">
          <span className="volunteer-label">BOYS (V)</span>

          <div className="volunteer-list">
            {approvedVolunteers.boys.map((person) => (
              <span key={person}>{person}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="coverage-note">
        <strong>Coverage procedure</strong>
        <p>{coverageInstructions}</p>
      </div>
    </section>
  );
}

function BreakDuties() {
  const [area, setArea] = useState<BreakArea>("downstairs");
  const [period, setPeriod] = useState<BreakPeriod>("Break 1");

  return (
    <>
      <DutyFinder />

      <div className="duty-control-panel">
        <div className="control-group">
          <span className="control-label">Area</span>

          <div className="duty-toggle">
            <button
              className={area === "downstairs" ? "selected" : ""}
              onClick={() => setArea("downstairs")}
              type="button"
            >
              Downstairs
            </button>

            <button
              className={area === "upstairs" ? "selected" : ""}
              onClick={() => setArea("upstairs")}
              type="button"
            >
              Upstairs
            </button>
          </div>
        </div>

        <div className="control-group">
          <span className="control-label">Break</span>

          <div className="duty-toggle">
            {breakPeriods.map((breakPeriod) => (
              <button
                className={period === breakPeriod ? "selected" : ""}
                key={breakPeriod}
                onClick={() => setPeriod(breakPeriod)}
                type="button"
              >
                {breakPeriod}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="schedule-heading">
        <div>
          <span className="eyebrow">WEEKLY ASSIGNMENTS</span>
          <h2>
            {area === "downstairs" ? "Downstairs" : "Upstairs"} · {period}
          </h2>
        </div>

        <span className="schedule-count">
          {area === "downstairs"
            ? "Monday–Thursday"
            : "Monday–Friday"}
        </span>
      </div>

      <BreakSchedule area={area} period={period} />

      <div className="schedule-footnote">
        <span>Schedule source</span>
        <p>
          Names and locations are displayed from the supplied 2027 SRC Duty
          Rotations data. Some names are abbreviated in the source sheet.
        </p>
      </div>

      <ApprovedVolunteers />
    </>
  );
}

function TimetableGrid({
  gender,
  type,
  selectedDay,
}: {
  gender: Gender;
  type: "transition" | "corridor";
  selectedDay: SchoolDay;
}) {
  const isFriday = selectedDay === "Friday";

  const slots =
    type === "transition"
      ? isFriday
        ? fridayTransitionTimes
        : transitionDutyTimes
      : isFriday
        ? fridayTransitionTimes
        : transitionDutyTimes;

  const locations =
    type === "transition"
      ? transitionDutyLocations
      : corridorDutyLocations;

  return (
    <div className="timetable-shell">
      <div className="timetable-scroll">
        <table className="timetable">
          <thead>
            <tr>
              <th>Duty Location</th>

              {slots.map((slot) => (
                <th key={slot.label}>
                  <span>{slot.label}</span>
                  <small>{slot.time}</small>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {locations.map((location) => (
              <tr key={location}>
                <td>
                  <strong>{location}</strong>
                  <span className="gender-tag">
                    {gender === "girls" ? "Girls" : "Boys"}
                  </span>
                </td>

                {slots.map((slot) => (
                  <td key={slot.label}>
                    <span className="unassigned">Unassigned</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyAssignmentNotice({
  text,
}: {
  text: string;
}) {
  return (
    <div className="assignment-notice">
      <div className="notice-marker">!</div>

      <div>
        <strong>Assignments not published in the supplied sheet</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function TransitionDuties() {
  const [gender, setGender] = useState<Gender>("girls");
  const [day, setDay] = useState<SchoolDay>("Monday");

  return (
    <>
      <div className="duty-control-panel">
        <div className="control-group">
          <span className="control-label">Duty group</span>

          <div className="duty-toggle">
            <button
              className={gender === "girls" ? "selected" : ""}
              onClick={() => setGender("girls")}
              type="button"
            >
              Girls
            </button>

            <button
              className={gender === "boys" ? "selected" : ""}
              onClick={() => setGender("boys")}
              type="button"
            >
              Boys
            </button>
          </div>
        </div>

        <div className="control-group">
          <span className="control-label">Day</span>

          <div className="day-picker">
            {schoolDays.map((schoolDay) => (
              <button
                className={day === schoolDay ? "selected" : ""}
                key={schoolDay}
                onClick={() => setDay(schoolDay)}
                type="button"
              >
                {dayShortLabels[schoolDay]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="schedule-heading">
        <div>
          <span className="eyebrow">TRANSITION TIMETABLE</span>
          <h2>
            {gender === "girls" ? "Girls" : "Boys"} · {day}
          </h2>
        </div>

        <span className="schedule-count">
          {day === "Friday" ? "Lessons 1–4" : "Lessons 1–7"}
        </span>
      </div>

      <TimetableGrid
        gender={gender}
        type="transition"
        selectedDay={day}
      />

      <EmptyAssignmentNotice
        text={
          gender === "girls"
            ? dutyDataStatus.transition.girls
            : dutyDataStatus.transition.boys
        }
      />

      <section className="duty-guidance">
        <span className="eyebrow">ROLE</span>
        <h3>Transition duty instructions</h3>
        <p>{transitionDutyRole}</p>
      </section>
    </>
  );
}

function CorridorDuties() {
  const [gender, setGender] = useState<Gender>("girls");
  const [day, setDay] = useState<SchoolDay>("Monday");

  return (
    <>
      <div className="duty-control-panel">
        <div className="control-group">
          <span className="control-label">Duty group</span>

          <div className="duty-toggle">
            <button
              className={gender === "girls" ? "selected" : ""}
              onClick={() => setGender("girls")}
              type="button"
            >
              Girls
            </button>

            <button
              className={gender === "boys" ? "selected" : ""}
              onClick={() => setGender("boys")}
              type="button"
            >
              Boys
            </button>
          </div>
        </div>

        <div className="control-group">
          <span className="control-label">Day</span>

          <div className="day-picker">
            {schoolDays.map((schoolDay) => (
              <button
                className={day === schoolDay ? "selected" : ""}
                key={schoolDay}
                onClick={() => setDay(schoolDay)}
                type="button"
              >
                {dayShortLabels[schoolDay]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="schedule-heading">
        <div>
          <span className="eyebrow">CORRIDOR TIMETABLE</span>
          <h2>
            {gender === "girls" ? "Girls" : "Boys"} · {day}
          </h2>
        </div>

        <span className="schedule-count">
          {day === "Friday" ? "Lessons 1–4" : "Lessons 1–7"}
        </span>
      </div>

      <TimetableGrid
        gender={gender}
        type="corridor"
        selectedDay={day}
      />

      <EmptyAssignmentNotice
        text={
          gender === "girls"
            ? dutyDataStatus.corridor.girls
            : dutyDataStatus.corridor.boys
        }
      />

      <section className="duty-guidance">
        <span className="eyebrow">ROLE</span>
        <h3>Corridor duty instructions</h3>
        <p>{corridorDutyRole}</p>
      </section>
    </>
  );
}

export default function DutiesPage() {
  const [section, setSection] = useState<DutySection>("breaks");

  return (
    <>
      <PageHeading />

      <main className="duties-page">
        <section className="duties-nav-section">
          <div className="duties-section-tabs">
            <TabButton
              active={section === "breaks"}
              onClick={() => setSection("breaks")}
            >
              Break Duty
            </TabButton>

            <TabButton
              active={section === "transition"}
              onClick={() => setSection("transition")}
            >
              Transition Duty
            </TabButton>

            <TabButton
              active={section === "corridor"}
              onClick={() => setSection("corridor")}
            >
              Corridor Duty
            </TabButton>
          </div>
        </section>

        {section === "breaks" ? (
          <BreakDuties />
        ) : section === "transition" ? (
          <TransitionDuties />
        ) : (
          <CorridorDuties />
        )}

        <section className="duty-bottom-grid">
          <div className="duty-bottom-card">
            <span className="eyebrow">PUBLIC SCHEDULE</span>
            <h3>Everything is organised around the duty location.</h3>
            <p>
              Break coverage is organised by physical post. Transition and
              corridor coverage is organised by lesson period and corridor.
            </p>
          </div>

          <div className="duty-bottom-card">
            <span className="eyebrow">ACCOUNTABILITY</span>
            <h3>Do not leave an assigned post uncovered.</h3>
            <p>
              The supplied schedule requires SRC members to arrange coverage in
              advance when they cannot complete their assigned duty.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}