import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useAuth } from "../auth/AuthContext";

const CALENDAR_API =
  "https://kulmkrqoadsoaocuovpe.supabase.co/functions/v1/runtime-test";

type CalendarCategory =
  | "school"
  | "src"
  | "event"
  | "meeting"
  | "deadline"
  | "academic"
  | "other";

type CalendarVisibility = "private" | "public";

type CalendarView = "month" | "week" | "day";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string | null;
  all_day: boolean;
  location: string | null;
  category: CalendarCategory;
  created_by: string;
  created_at: string;
  updated_at: string;
  visibility: CalendarVisibility;
}

interface CalendarResponse {
  ok: boolean;
  authenticated?: boolean;
  authorized?: boolean;
  uid?: string;
  position?: string;
  events?: CalendarEvent[];
  error?: string;
  message?: string;
}

interface EventResponse {
  ok: boolean;
  created?: boolean;
  updated?: boolean;
  deleted?: boolean;
  event?: CalendarEvent;
  id?: string;
  error?: string;
  message?: string;
}

interface EventForm {
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  all_day: boolean;
  location: string;
  category: CalendarCategory;
  visibility: CalendarVisibility;
}

const CATEGORY_OPTIONS: {
  value: CalendarCategory;
  label: string;
}[] = [
  { value: "school", label: "School" },
  { value: "src", label: "SRC" },
  { value: "event", label: "Event" },
  { value: "meeting", label: "Meeting" },
  { value: "deadline", label: "Deadline" },
  { value: "academic", label: "Academic" },
  { value: "other", label: "Other" },
];

const VISIBILITY_OPTIONS: {
  value: CalendarVisibility;
  label: string;
}[] = [
  { value: "private", label: "Private" },
  { value: "public", label: "Public" },
];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HOUR_HEIGHT = 64;
const START_HOUR = 7;
const END_HOUR = 22;

const EMPTY_FORM: EventForm = {
  title: "",
  description: "",
  start_at: "",
  end_at: "",
  all_day: false,
  location: "",
  category: "other",
  visibility: "private",
};

function cloneDate(date: Date) {
  return new Date(date.getTime());
}

function startOfDay(date: Date) {
  const result = cloneDate(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function startOfMonth(date: Date) {
  const result = startOfDay(date);
  result.setDate(1);
  return result;
}

function startOfWeek(date: Date) {
  const result = startOfDay(date);
  result.setDate(result.getDate() - result.getDay());
  return result;
}

function addDays(date: Date, amount: number) {
  const result = cloneDate(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function addMonths(date: Date, amount: number) {
  const result = cloneDate(date);
  result.setMonth(result.getMonth() + amount);
  return result;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatWeekTitle(date: Date) {
  const start = startOfWeek(date);
  const end = addDays(start, 6);

  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    return `${new Intl.DateTimeFormat(undefined, {
      month: "long",
    }).format(start)} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`;
  }

  return `${new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(start)} – ${new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(end)}`;
}

function formatDayTitle(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTimeOnly(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "No time specified";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDateOnly(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toDateTimeLocalFromDate(
  date: Date,
  hour = 9,
  minute = 0,
) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(hour).padStart(2, "0");
  const minutes = String(minute).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function categoryLabel(category: CalendarCategory) {
  return (
    CATEGORY_OPTIONS.find(
      (option) => option.value === category,
    )?.label ?? "Other"
  );
}

function categoryClass(category: CalendarCategory) {
  return `calendar-event-${category}`;
}

function sortEvents(events: CalendarEvent[]) {
  return [...events].sort(
    (a, b) =>
      new Date(a.start_at).getTime() -
      new Date(b.start_at).getTime(),
  );
}

function getEventsForDay(
  events: CalendarEvent[],
  date: Date,
) {
  return sortEvents(
    events.filter((event) =>
      sameDay(new Date(event.start_at), date),
    ),
  );
}

function getMonthDays(date: Date) {
  const first = startOfMonth(date);
  const gridStart = startOfWeek(first);

  return Array.from({ length: 42 }, (_, index) =>
    addDays(gridStart, index),
  );
}

function getVisibleWeekDays(date: Date) {
  const start = startOfWeek(date);

  return Array.from({ length: 7 }, (_, index) =>
    addDays(start, index),
  );
}

function minutesFromMidnight(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function eventTop(date: Date) {
  const minutes =
    minutesFromMidnight(date) - START_HOUR * 60;

  return Math.max(0, (minutes / 60) * HOUR_HEIGHT);
}

function eventHeight(start: Date, end: Date | null) {
  if (!end) {
    return 40;
  }

  const duration =
    (end.getTime() - start.getTime()) / 60000;

  return Math.max(28, (duration / 60) * HOUR_HEIGHT);
}

function clampEventEnd(event: CalendarEvent) {
  const start = new Date(event.start_at);

  if (!event.end_at) {
    return new Date(start.getTime() + 60 * 60 * 1000);
  }

  const end = new Date(event.end_at);

  if (Number.isNaN(end.getTime()) || end <= start) {
    return new Date(start.getTime() + 60 * 60 * 1000);
  }

  return end;
}

export default function CalendarPage() {
  const {
    user,
    isLeadership,
    loading: authLoading,
  } = useAuth();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null,
  );

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [calendarView, setCalendarView] =
    useState<CalendarView>("month");

  const [currentDate, setCurrentDate] = useState(
    () => new Date(),
  );

  const [selectedEvent, setSelectedEvent] =
    useState<CalendarEvent | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingEventId, setEditingEventId] =
    useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(EMPTY_FORM);

  const monthDays = useMemo(
    () => getMonthDays(currentDate),
    [currentDate],
  );

  const weekDays = useMemo(
    () => getVisibleWeekDays(currentDate),
    [currentDate],
  );

  const today = useMemo(() => new Date(), []);

  const visibleDays =
    calendarView === "day"
      ? [startOfDay(currentDate)]
      : weekDays;

  const getAuthorizationHeader = useCallback(async () => {
    if (!user) {
      throw new Error("You must be signed in.");
    }

    const token = await user.getIdToken();

    if (!token) {
      throw new Error(
        "Could not obtain a Firebase authentication token.",
      );
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [user]);

  const loadEvents = useCallback(async () => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthorizationHeader();

      const response = await fetch(CALENDAR_API, {
        method: "GET",
        headers,
      });

      const data =
        (await response.json()) as CalendarResponse;

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Failed to load calendar events (${response.status}).`,
        );
      }

      if (!data.authorized) {
        throw new Error(
          "Your account is authenticated but is not authorized for the leadership calendar.",
        );
      }

      setEvents(data.events ?? []);
    } catch (requestError) {
      console.error(
        "Failed to load calendar events:",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load calendar events.",
      );
    } finally {
      setLoading(false);
    }
  }, [getAuthorizationHeader, user]);

  useEffect(() => {
    if (!authLoading && user && isLeadership) {
      void loadEvents();
    }

    if (!authLoading && (!user || !isLeadership)) {
      setLoading(false);
    }
  }, [
    authLoading,
    isLeadership,
    loadEvents,
    user,
  ]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingEventId(null);
    setShowForm(false);
  };

  const openCreateForm = (
    date?: Date,
    hour?: number,
  ) => {
    setError(null);
    setSuccess(null);
    setSelectedEvent(null);
    setEditingEventId(null);

    const targetDate = date
      ? cloneDate(date)
      : cloneDate(currentDate);

    if (hour !== undefined) {
      targetDate.setHours(hour, 0, 0, 0);
    }

    const startValue = toDateTimeLocalFromDate(
      targetDate,
      hour ?? 9,
      0,
    );

    const endDate = cloneDate(targetDate);
    endDate.setHours((hour ?? 9) + 1, 0, 0, 0);

    setForm({
      ...EMPTY_FORM,
      start_at: startValue,
      end_at: toDateTimeLocalFromDate(
        endDate,
        (hour ?? 9) + 1,
        0,
      ),
    });

    setShowForm(true);
  };

  const openEditForm = (event: CalendarEvent) => {
    setError(null);
    setSuccess(null);
    setSelectedEvent(null);
    setEditingEventId(event.id);

    setForm({
      title: event.title,
      description: event.description ?? "",
      start_at: toDateTimeLocal(event.start_at),
      end_at: toDateTimeLocal(event.end_at),
      all_day: event.all_day,
      location: event.location ?? "",
      category: event.category,
      visibility: event.visibility,
    });

    setShowForm(true);
  };

  const updateForm = <K extends keyof EventForm>(
    field: K,
    value: EventForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    submitEvent: FormEvent<HTMLFormElement>,
  ) => {
    submitEvent.preventDefault();

    setError(null);
    setSuccess(null);

    if (!user) {
      setError("You must be signed in.");
      return;
    }

    const title = form.title.trim();

    if (!title) {
      setError("Event title is required.");
      return;
    }

    if (!form.start_at) {
      setError("Start date and time are required.");
      return;
    }

    if (
      !form.all_day &&
      form.end_at &&
      new Date(form.end_at).getTime() <
        new Date(form.start_at).getTime()
    ) {
      setError(
        "The event end time cannot be before the start time.",
      );
      return;
    }

    setSaving(true);

    try {
      const headers = await getAuthorizationHeader();

      const payload = {
        title,
        description:
          form.description.trim() || null,
        start_at: new Date(
          form.start_at,
        ).toISOString(),
        end_at: form.end_at
          ? new Date(form.end_at).toISOString()
          : null,
        all_day: form.all_day,
        location:
          form.location.trim() || null,
        category: form.category,
        visibility: form.visibility,
      };

      const isEditing = Boolean(editingEventId);

      const response = await fetch(CALENDAR_API, {
        method: isEditing ? "PATCH" : "POST",
        headers,
        body: JSON.stringify(
          isEditing
            ? {
                id: editingEventId,
                ...payload,
              }
            : payload,
        ),
      });

      const data =
        (await response.json()) as EventResponse;

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Failed to ${
              isEditing ? "update" : "create"
            } the event (${response.status}).`,
        );
      }

      if (!data.event) {
        throw new Error(
          "The server did not return the saved event.",
        );
      }

      if (isEditing) {
        setEvents((current) =>
          sortEvents(
            current.map((existingEvent) =>
              existingEvent.id === data.event!.id
                ? data.event!
                : existingEvent,
            ),
          ),
        );

        setSuccess("Event updated successfully.");
      } else {
        setEvents((current) =>
          sortEvents([...current, data.event!]),
        );

        setSuccess("Event created successfully.");
      }

      resetForm();
    } catch (requestError) {
      console.error(
        "Failed to save calendar event:",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to save calendar event.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    const eventToDelete = events.find(
      (event) => event.id === eventId,
    );

    if (!eventToDelete) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${eventToDelete.title}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(eventId);
    setError(null);
    setSuccess(null);

    try {
      const headers = await getAuthorizationHeader();

      const response = await fetch(CALENDAR_API, {
        method: "DELETE",
        headers,
        body: JSON.stringify({
          id: eventId,
        }),
      });

      const data =
        (await response.json()) as EventResponse;

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Failed to delete the event (${response.status}).`,
        );
      }

      setEvents((current) =>
        current.filter(
          (calendarEvent) =>
            calendarEvent.id !== eventId,
        ),
      );

      setSelectedEvent(null);
      setSuccess("Event deleted successfully.");
    } catch (requestError) {
      console.error(
        "Failed to delete calendar event:",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to delete calendar event.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const moveCalendar = (direction: number) => {
  if (calendarView === "month") {
    setCurrentDate((date) =>
      addMonths(date, direction),
    );
    return;
  }

  setCurrentDate((date) =>
    addDays(
      date,
      direction * (calendarView === "week" ? 7 : 1),
    ),
  );
};

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const calendarTitle =
    calendarView === "month"
      ? formatMonthTitle(currentDate)
      : calendarView === "week"
        ? formatWeekTitle(currentDate)
        : formatDayTitle(currentDate);

  const renderEventButton = (
    event: CalendarEvent,
    compact = false,
  ) => (
    <button
      key={event.id}
      type="button"
      className={`calendar-event ${categoryClass(
        event.category,
      )} ${compact ? "calendar-event-compact" : ""}`}
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        setSelectedEvent(event);
      }}
      title={`${event.title} — ${categoryLabel(
        event.category,
      )}`}
    >
      <span className="calendar-event-title">
        {event.title}
      </span>

      {!event.all_day && !compact && (
        <span className="calendar-event-time">
          {formatTimeOnly(event.start_at)}
        </span>
      )}
    </button>
  );

  if (authLoading || loading) {
    return (
      <main className="calendar-page">
        <div className="calendar-shell">
          <div className="calendar-state-card">
            <div className="calendar-loading-mark">
              <span />
              <span />
              <span />
            </div>
            <p>Loading leadership calendar…</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="calendar-page">
        <div className="calendar-shell">
          <div className="calendar-state-card">
            <span className="calendar-state-eyebrow">
              WSR CONNECT
            </span>
            <h1>Leadership Calendar</h1>
            <p>
              You must be signed in to access the
              leadership calendar.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!isLeadership) {
    return (
      <main className="calendar-page">
        <div className="calendar-shell">
          <div className="calendar-state-card">
            <span className="calendar-state-eyebrow">
              ACCESS RESTRICTED
            </span>
            <h1>Leadership Calendar</h1>
            <p>
              The calendar is available only to the
              senior SRC leadership team.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="calendar-page">
      <div className="calendar-shell">
        <header className="calendar-header">
          <div>
            <span className="calendar-eyebrow">
              WSR CONNECT / LEADERSHIP
            </span>

            <div className="calendar-title-row">
              <h1>Calendar</h1>
              <span className="calendar-event-count">
                {events.length}{" "}
                {events.length === 1
                  ? "event"
                  : "events"}
              </span>
            </div>
          </div>

          <div className="calendar-header-actions">
            <button
              type="button"
              className="calendar-secondary-button"
              onClick={() => void loadEvents()}
              disabled={loading || saving}
            >
              Refresh
            </button>

            <button
              type="button"
              className="calendar-primary-button"
              onClick={() => openCreateForm()}
            >
              <span aria-hidden="true">+</span>
              New event
            </button>
          </div>
        </header>

        {(error || success) && (
          <div
            className={`calendar-alert ${
              error
                ? "calendar-alert-error"
                : "calendar-alert-success"
            }`}
          >
            <span>{error || success}</span>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setSuccess(null);
              }}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        <section className="calendar-card">
          <div className="calendar-toolbar">
            <div className="calendar-toolbar-left">
              <button
                type="button"
                className="calendar-today-button"
                onClick={goToToday}
              >
                Today
              </button>

              <div className="calendar-nav-buttons">
                <button
                  type="button"
                  onClick={() => moveCalendar(-1)}
                  aria-label="Previous"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={() => moveCalendar(1)}
                  aria-label="Next"
                >
                  ›
                </button>
              </div>

              <h2>{calendarTitle}</h2>
            </div>

            <div className="calendar-view-switcher">
              {(
                [
                  ["month", "Month"],
                  ["week", "Week"],
                  ["day", "Day"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={
                    calendarView === value
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCalendarView(value)
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {calendarView === "month" && (
            <div className="calendar-month">
              <div className="calendar-weekday-row">
                {WEEKDAY_LABELS.map((label) => (
                  <div
                    key={label}
                    className="calendar-weekday"
                  >
                    {label}
                  </div>
                ))}
              </div>

              <div className="calendar-month-grid">
                {monthDays.map((day) => {
                  const dayEvents = getEventsForDay(
                    events,
                    day,
                  );
                  const isCurrentMonth =
                    day.getMonth() ===
                      currentDate.getMonth() &&
                    day.getFullYear() ===
                      currentDate.getFullYear();
                  const isToday = sameDay(day, today);

                  const allDayEvents =
                    dayEvents.filter(
                      (event) => event.all_day,
                    );

                  const timedEvents =
                    dayEvents.filter(
                      (event) => !event.all_day,
                    );

                  return (
                    <div
                      key={dateKey(day)}
                      className={`calendar-month-day ${
                        isCurrentMonth
                          ? ""
                          : "calendar-month-day-muted"
                      } ${
                        isToday
                          ? "calendar-month-day-today"
                          : ""
                      }`}
                      onClick={() =>
                        openCreateForm(day)
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(keyboardEvent) => {
                        if (
                          keyboardEvent.key ===
                            "Enter" ||
                          keyboardEvent.key === " "
                        ) {
                          keyboardEvent.preventDefault();
                          openCreateForm(day);
                        }
                      }}
                    >
                      <div className="calendar-day-number">
                        <span
                          className={
                            isToday
                              ? "calendar-today-number"
                              : ""
                          }
                        >
                          {day.getDate()}
                        </span>
                      </div>

                      <div className="calendar-day-events">
                        {allDayEvents
                          .slice(0, 3)
                          .map((event) =>
                            renderEventButton(
                              event,
                              true,
                            ),
                          )}

                        {timedEvents
                          .slice(
                            0,
                            Math.max(
                              0,
                              4 -
                                Math.min(
                                  3,
                                  allDayEvents.length,
                                ),
                            ),
                          )
                          .map((event) =>
                            renderEventButton(
                              event,
                              true,
                            ),
                          )}

                        {dayEvents.length > 4 && (
                          <button
                            type="button"
                            className="calendar-more-events"
                            onClick={(event) => {
                              event.stopPropagation();
                              setCurrentDate(day);
                              setCalendarView("day");
                            }}
                          >
                            +{" "}
                            {dayEvents.length - 4} more
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(calendarView === "week" ||
            calendarView === "day") && (
            <div className="calendar-time-view">
              <div
                className="calendar-time-header"
                style={{
                  gridTemplateColumns: `68px repeat(${visibleDays.length}, minmax(0, 1fr))`,
                }}
              >
                <div className="calendar-time-header-spacer" />

                {visibleDays.map((day) => (
                  <div
                    key={dateKey(day)}
                    className={`calendar-time-day-header ${
                      sameDay(day, today)
                        ? "calendar-time-day-today"
                        : ""
                    }`}
                  >
                    <span>
                      {new Intl.DateTimeFormat(
                        undefined,
                        {
                          weekday: "short",
                        },
                      ).format(day)}
                    </span>

                    <strong>{day.getDate()}</strong>
                  </div>
                ))}
              </div>

              <div className="calendar-all-day-row">
                <div className="calendar-all-day-label">
                  All-day
                </div>

                {visibleDays.map((day) => {
                  const allDayEvents =
                    getEventsForDay(
                      events,
                      day,
                    ).filter(
                      (event) => event.all_day,
                    );

                  return (
                    <div
                      key={dateKey(day)}
                      className="calendar-all-day-cell"
                      onClick={() =>
                        openCreateForm(day)
                      }
                    >
                      {allDayEvents.map((event) =>
                        renderEventButton(
                          event,
                          true,
                        ),
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="calendar-time-body">
                <div className="calendar-time-labels">
                  {Array.from(
                    {
                      length:
                        END_HOUR - START_HOUR + 1,
                    },
                    (_, index) => {
                      const hour =
                        START_HOUR + index;

                      return (
                        <div
                          key={hour}
                          className="calendar-time-label"
                          style={{
                            height: HOUR_HEIGHT,
                          }}
                        >
                          {new Intl.DateTimeFormat(
                            undefined,
                            {
                              hour: "numeric",
                            },
                          ).format(
                            new Date(
                              2000,
                              0,
                              1,
                              hour,
                            ),
                          )}
                        </div>
                      );
                    },
                  )}
                </div>

                {visibleDays.map((day) => {
                  const dayEvents =
                    getEventsForDay(
                      events,
                      day,
                    ).filter(
                      (event) => !event.all_day,
                    );

                  return (
                    <div
                      key={dateKey(day)}
                      className={`calendar-time-column ${
                        sameDay(day, today)
                          ? "calendar-time-column-today"
                          : ""
                      }`}
                    >
                      {Array.from(
                        {
                          length:
                            END_HOUR - START_HOUR,
                        },
                        (_, index) => (
                          <button
                            key={index}
                            type="button"
                            className="calendar-hour-slot"
                            style={{
                              height: HOUR_HEIGHT,
                            }}
                            onClick={() =>
                              openCreateForm(
                                day,
                                START_HOUR +
                                  index,
                              )
                            }
                            aria-label={`Create event at ${
                              START_HOUR + index
                            }:00`}
                          />
                        ),
                      )}

                      <div className="calendar-timed-events">
                        {dayEvents.map((event) => {
                          const start = new Date(
                            event.start_at,
                          );
                          const end =
                            clampEventEnd(event);

                          const top =
                            eventTop(start);
                          const height =
                            eventHeight(start, end);

                          const visibleStart =
                            Math.max(
                              0,
                              top,
                            );

                          const visibleEnd =
                            Math.min(
                              (END_HOUR -
                                START_HOUR) *
                                HOUR_HEIGHT,
                              top + height,
                            );

                          if (
                            visibleEnd <=
                            visibleStart
                          ) {
                            return null;
                          }

                          return (
                            <button
                              key={event.id}
                              type="button"
                              className={`calendar-timed-event ${categoryClass(
                                event.category,
                              )}`}
                              style={{
                                top: visibleStart,
                                height:
                                  visibleEnd -
                                  visibleStart,
                              }}
                              onClick={(clickEvent) => {
                                clickEvent.stopPropagation();
                                setSelectedEvent(
                                  event,
                                );
                              }}
                            >
                              <strong>
                                {event.title}
                              </strong>

                              <span>
                                {formatTimeOnly(
                                  event.start_at,
                                )}
                                {event.end_at
                                  ? ` – ${formatTimeOnly(
                                      event.end_at,
                                    )}`
                                  : ""}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {sameDay(day, today) && (
                        <div
                          className="calendar-current-time-line"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>

      {selectedEvent && (
        <div
          className="calendar-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedEvent(null);
            }
          }}
        >
          <section
            className="calendar-event-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-event-title"
          >
            <div className="calendar-modal-top">
              <div
                className={`calendar-modal-category ${categoryClass(
                  selectedEvent.category,
                )}`}
              >
                {categoryLabel(
                  selectedEvent.category,
                )}
              </div>

              <button
                type="button"
                className="calendar-modal-close"
                onClick={() =>
                  setSelectedEvent(null)
                }
                aria-label="Close event"
              >
                ×
              </button>
            </div>

            <h2 id="calendar-event-title">
              {selectedEvent.title}
            </h2>

            <div className="calendar-event-meta">
              <div>
                <span className="calendar-meta-icon">
                  ◷
                </span>

                <div>
                  <strong>
                    {selectedEvent.all_day
                      ? formatDateOnly(
                          selectedEvent.start_at,
                        )
                      : formatDateTime(
                          selectedEvent.start_at,
                        )}
                  </strong>

                  {!selectedEvent.all_day &&
                    selectedEvent.end_at && (
                      <span>
                        Ends{" "}
                        {formatTimeOnly(
                          selectedEvent.end_at,
                        )}
                      </span>
                    )}
                </div>
              </div>

              {selectedEvent.location && (
                <div>
                  <span className="calendar-meta-icon">
                    ⌖
                  </span>

                  <div>
                    <strong>Location</strong>
                    <span>
                      {selectedEvent.location}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <span className="calendar-meta-icon">
                  ●
                </span>

                <div>
                  <strong>Visibility</strong>
                  <span>
                    {selectedEvent.visibility ===
                    "public"
                      ? "Public"
                      : "Private"}
                  </span>
                </div>
              </div>
            </div>

            {selectedEvent.description && (
              <div className="calendar-event-description">
                <span>Description</span>
                <p>
                  {selectedEvent.description}
                </p>
              </div>
            )}

            <div className="calendar-modal-actions">
              <button
                type="button"
                className="calendar-danger-button"
                disabled={
                  deletingId === selectedEvent.id
                }
                onClick={() =>
                  void handleDelete(
                    selectedEvent.id,
                  )
                }
              >
                {deletingId === selectedEvent.id
                  ? "Deleting…"
                  : "Delete"}
              </button>

              <button
                type="button"
                className="calendar-primary-button"
                onClick={() =>
                  openEditForm(selectedEvent)
                }
              >
                Edit event
              </button>
            </div>
          </section>
        </div>
      )}

      {showForm && (
        <div
          className="calendar-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !saving
            ) {
              resetForm();
            }
          }}
        >
          <section
            className="calendar-form-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-form-title"
          >
            <div className="calendar-modal-top">
              <div>
                <span className="calendar-modal-eyebrow">
                  {editingEventId
                    ? "EDIT EVENT"
                    : "NEW EVENT"}
                </span>

                <h2 id="calendar-form-title">
                  {editingEventId
                    ? "Update event"
                    : "Add to calendar"}
                </h2>
              </div>

              <button
                type="button"
                className="calendar-modal-close"
                onClick={resetForm}
                disabled={saving}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="calendar-form"
            >
              <label className="calendar-form-field calendar-form-field-wide">
                <span>Title</span>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    updateForm(
                      "title",
                      event.target.value,
                    )
                  }
                  placeholder="SRC Leadership Meeting"
                  maxLength={200}
                  disabled={saving}
                  autoFocus
                />
              </label>

              <div className="calendar-form-grid">
                <label className="calendar-form-field">
                  <span>Start</span>

                  <input
                    type="datetime-local"
                    value={form.start_at}
                    onChange={(event) =>
                      updateForm(
                        "start_at",
                        event.target.value,
                      )
                    }
                    disabled={saving}
                  />
                </label>

                <label className="calendar-form-field">
                  <span>End</span>

                  <input
                    type="datetime-local"
                    value={form.end_at}
                    onChange={(event) =>
                      updateForm(
                        "end_at",
                        event.target.value,
                      )
                    }
                    disabled={
                      saving || form.all_day
                    }
                  />
                </label>

                <label className="calendar-form-field">
                  <span>Category</span>

                  <select
                    value={form.category}
                    onChange={(event) =>
                      updateForm(
                        "category",
                        event.target
                          .value as CalendarCategory,
                      )
                    }
                    disabled={saving}
                  >
                    {CATEGORY_OPTIONS.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="calendar-form-field">
                  <span>Visibility</span>

                  <select
                    value={form.visibility}
                    onChange={(event) =>
                      updateForm(
                        "visibility",
                        event.target
                          .value as CalendarVisibility,
                      )
                    }
                    disabled={saving}
                  >
                    {VISIBILITY_OPTIONS.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>
                </label>
              </div>

              <label className="calendar-checkbox">
                <input
                  type="checkbox"
                  checked={form.all_day}
                  onChange={(event) =>
                    updateForm(
                      "all_day",
                      event.target.checked,
                    )
                  }
                  disabled={saving}
                />

                <span>
                  <strong>All-day event</strong>
                  <small>
                    Use this for events without a
                    specific time.
                  </small>
                </span>
              </label>

              <label className="calendar-form-field">
                <span>Location</span>

                <input
                  type="text"
                  value={form.location}
                  onChange={(event) =>
                    updateForm(
                      "location",
                      event.target.value,
                    )
                  }
                  placeholder="Main Hall"
                  maxLength={300}
                  disabled={saving}
                />
              </label>

              <label className="calendar-form-field">
                <span>Description</span>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm(
                      "description",
                      event.target.value,
                    )
                  }
                  placeholder="Add useful details…"
                  rows={4}
                  maxLength={2000}
                  disabled={saving}
                />
              </label>

              <div className="calendar-form-actions">
                <button
                  type="button"
                  className="calendar-secondary-button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="calendar-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving…"
                    : editingEventId
                      ? "Save changes"
                      : "Create event"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}