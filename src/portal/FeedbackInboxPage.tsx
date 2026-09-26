import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../auth/AuthContext";

const LEADERSHIP_FEEDBACK_URL =
  "https://kulmkrqoadsoaocuovpe.supabase.co/functions/v1/leadership-feedback";

type FeedbackStatus =
  | "new"
  | "in_review"
  | "resolved"
  | "archived";

type FeedbackCategory =
  | "suggestion"
  | "concern"
  | "event"
  | "facilities"
  | "src"
  | "website"
  | "report"
  | "other";

type LeadershipPosition =
  | "head_boy"
  | "head_girl"
  | "assistant_head_boy"
  | "assistant_head_girl";

interface FeedbackAttachment {
  id: string;
  feedback_id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  created_at: string;
  content_type: string | null;
}

interface FeedbackRecord {
  id: string;
  full_name: string;
  grade_section: string;
  email: string | null;
  category: FeedbackCategory;
  subject: string;
  message: string;
  request_response: boolean;
  request_staff_involvement: boolean;
  status: FeedbackStatus;
  internal_notes: string | null;
  response: string | null;
  response_sent_at: string | null;
  responded_by: string | null;
  delegated_to_position: LeadershipPosition | null;
  delegated_by: string | null;
  delegated_at: string | null;
  created_at: string;
  updated_at: string;
  attachments: FeedbackAttachment[];
}

interface LeadershipFeedbackResponse {
  ok: boolean;
  authenticated: boolean;
  authorized: boolean;
  uid: string;
  position: string | null;
  feedback: FeedbackRecord[];
}

interface MutationResponse {
  ok: boolean;
  action?: string;
  error?: string;
  feedback?: Partial<FeedbackRecord>;
  attachment?: {
    attachment_id: string;
    file_name: string;
    mime_type: string;
    file_size: number;
    expires_in: number;
    url: string;
  };
}

const statusLabels: Record<FeedbackStatus, string> = {
  new: "New",
  in_review: "In Review",
  resolved: "Resolved",
  archived: "Archived",
};

const categoryLabels: Record<FeedbackCategory, string> = {
  suggestion: "Suggestion",
  concern: "Concern",
  event: "Event",
  facilities: "Facilities",
  src: "SRC / Student Leadership",
  website: "WSR Connect / Website",
  report: "Report",
  other: "Other",
};

const leadershipPositions: LeadershipPosition[] = [
  "head_boy",
  "head_girl",
  "assistant_head_boy",
  "assistant_head_girl",
];

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

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function statusClassName(status: FeedbackStatus) {
  return `feedback-inbox-status feedback-inbox-status-${status}`;
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        padding: "40px 24px",
        border: "1px solid #D9DDE1",
        background: "#FFFFFF",
        textAlign: "center",
      }}
    >
      <strong
        style={{
          display: "block",
          fontSize: "18px",
          marginBottom: "8px",
        }}
      >
        {title}
      </strong>

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
    </div>
  );
}

function ActionMessage({
  message,
  error = false,
}: {
  message: string;
  error?: boolean;
}) {
  return (
    <div
      style={{
        marginTop: "12px",
        padding: "12px 14px",
        border: error
          ? "1px solid #E3B4B4"
          : "1px solid #C9DCCB",
        background: error
          ? "#FFF7F7"
          : "#F4FAF5",
        color: error ? "#8C2F2F" : "#35643A",
        fontSize: "13px",
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  );
}

export default function FeedbackInboxPage() {
  const { user, position } = useAuth();

  const [feedback, setFeedback] =
    useState<FeedbackRecord[]>([]);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<"all" | FeedbackStatus>("all");

  const [categoryFilter, setCategoryFilter] =
    useState<"all" | FeedbackCategory>("all");

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [actionMessage, setActionMessage] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  const [notesDraft, setNotesDraft] =
    useState("");

  const [responseDraft, setResponseDraft] =
    useState("");

  const [delegationDraft, setDelegationDraft] =
    useState<LeadershipPosition | "">("");

  async function loadFeedback(
    preserveActionMessages = false,
  ) {
    if (!user) {
      setLoading(false);
      setErrorMessage(
        "You must be signed in to access the feedback inbox.",
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    if (!preserveActionMessages) {
      setActionMessage("");
      setActionError("");
    }

    try {
      const token =
        await user.getIdToken(true);

      const response = await fetch(
        LEADERSHIP_FEEDBACK_URL,
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        },
      );

      const result =
        (await response.json()) as Partial<LeadershipFeedbackResponse> & {
          error?: string;
        };

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Failed to load the leadership feedback inbox.",
        );
      }

      if (
        result.ok !== true ||
        result.authorized !== true ||
        !Array.isArray(result.feedback)
      ) {
        throw new Error(
          "The leadership feedback service returned an invalid response.",
        );
      }

      setFeedback(result.feedback);

      setSelectedId((currentSelectedId) => {
        if (
          currentSelectedId &&
          result.feedback?.some(
            (item) =>
              item.id === currentSelectedId,
          )
        ) {
          return currentSelectedId;
        }

        return result.feedback?.[0]?.id ?? null;
      });
    } catch (error) {
      console.error(
        "Leadership feedback loading failed:",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load the leadership feedback inbox.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadFeedback();
  }, [user]);

  const filteredFeedback = useMemo(() => {
    return feedback.filter((item) => {
      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        item.category === categoryFilter;

      return (
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    feedback,
    statusFilter,
    categoryFilter,
  ]);

  const selectedFeedback = useMemo(() => {
    if (!selectedId) {
      return null;
    }

    return (
      filteredFeedback.find(
        (item) => item.id === selectedId,
      ) ?? null
    );
  }, [
    filteredFeedback,
    selectedId,
  ]);

  useEffect(() => {
    if (!selectedFeedback) {
      setNotesDraft("");
      setResponseDraft("");
      setDelegationDraft("");
      return;
    }

    setNotesDraft(
      selectedFeedback.internal_notes ?? "",
    );

    setResponseDraft(
      selectedFeedback.response ?? "",
    );

    setDelegationDraft(
      selectedFeedback.delegated_to_position ??
        "",
    );

    setActionMessage("");
    setActionError("");
  }, [selectedFeedback?.id]);

  const statusCounts = useMemo(() => {
    return {
      all: feedback.length,
      new: feedback.filter(
        (item) => item.status === "new",
      ).length,
      in_review: feedback.filter(
        (item) => item.status === "in_review",
      ).length,
      resolved: feedback.filter(
        (item) => item.status === "resolved",
      ).length,
      archived: feedback.filter(
        (item) => item.status === "archived",
      ).length,
    };
  }, [feedback]);

  async function performAction(
    action: string,
    payload: Record<string, unknown> = {},
  ) {
    if (!user || !selectedFeedback) {
      return false;
    }

    setActionLoading(action);
    setActionMessage("");
    setActionError("");

    try {
      const token =
        await user.getIdToken(true);

      const response = await fetch(
        LEADERSHIP_FEEDBACK_URL,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action,
            feedback_id:
              selectedFeedback.id,
            ...payload,
          }),
        },
      );

      const result =
        (await response.json()) as MutationResponse;

      if (!response.ok || result.ok !== true) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "The requested feedback operation failed.",
        );
      }

      return result;
    } catch (error) {
      console.error(
        `Feedback action "${action}" failed:`,
        error,
      );

      setActionError(
        error instanceof Error
          ? error.message
          : "The requested operation failed.",
      );

      return false;
    } finally {
      setActionLoading(null);
    }
  }

  async function handleStatusChange(
    status: FeedbackStatus,
  ) {
    const result =
      await performAction(
        "update_status",
        { status },
      );

    if (!result) {
      return;
    }

    setActionMessage(
      `Status changed to ${statusLabels[status]}.`,
    );

    await loadFeedback(true);
  }

  async function handleSaveNotes() {
    const result =
      await performAction(
        "update_notes",
        {
          internal_notes:
            notesDraft,
        },
      );

    if (!result) {
      return;
    }

    setActionMessage(
      "Internal notes saved.",
    );

    await loadFeedback(true);
  }

  async function handleSaveResponse() {
    const trimmedResponse =
      responseDraft.trim();

    if (!trimmedResponse) {
      setActionError(
        "Enter a response before saving it.",
      );
      return;
    }

    const result =
      await performAction(
        "save_response",
        {
          response:
            trimmedResponse,
        },
      );

    if (!result) {
      return;
    }

    setActionMessage(
      "Response saved to the feedback record.",
    );

    await loadFeedback(true);
  }

  async function handleDelegationChange(
    value: LeadershipPosition | "",
  ) {
    setDelegationDraft(value);

    const result =
      await performAction(
        "delegate",
        {
          delegated_to_position:
            value || null,
        },
      );

    if (!result) {
      return;
    }

    setActionMessage(
      value
        ? `Delegated to ${formatPosition(value)}.`
        : "Delegation cleared.",
    );

    await loadFeedback(true);
  }

  async function handleAttachmentOpen(
    attachment: FeedbackAttachment,
  ) {
    if (!user || !selectedFeedback) {
      return;
    }

    setActionLoading(
      `attachment:${attachment.id}`,
    );

    setActionMessage("");
    setActionError("");

    try {
      const token =
        await user.getIdToken(true);

      const response = await fetch(
        LEADERSHIP_FEEDBACK_URL,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "attachment_url",
            feedback_id:
              selectedFeedback.id,
            attachment_id:
              attachment.id,
          }),
        },
      );

      const result =
        (await response.json()) as MutationResponse;

      if (
        !response.ok ||
        result.ok !== true ||
        !result.attachment?.url
      ) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Unable to open the private attachment.",
        );
      }

      window.open(
        result.attachment.url,
        "_blank",
        "noopener,noreferrer",
      );

      setActionMessage(
        "Private attachment access granted for 5 minutes.",
      );
    } catch (error) {
      console.error(
        "Attachment access failed:",
        error,
      );

      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to open the private attachment.",
      );
    } finally {
      setActionLoading(null);
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
          maxWidth: "1200px",
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
              justifyContent:
                "space-between",
              alignItems:
                "flex-start",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing:
                    "0.1em",
                  textTransform:
                    "uppercase",
                  opacity: 0.75,
                }}
              >
                Leadership Workspace
              </span>

              <h1
                style={{
                  margin: "0 0 10px",
                  fontSize:
                    "clamp(30px, 5vw, 44px)",
                  lineHeight: 1.05,
                  letterSpacing:
                    "-0.03em",
                }}
              >
                Feedback Inbox
              </h1>

              <p
                style={{
                  margin: 0,
                  maxWidth: "680px",
                  color: "#FFFFFF",
                  opacity: 0.85,
                  lineHeight: 1.6,
                }}
              >
                Review feedback submitted
                through WSR Connect and
                manage the leadership
                response process.
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
                  letterSpacing:
                    "0.08em",
                  textTransform:
                    "uppercase",
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
                {formatPosition(
                  position,
                )}
              </strong>

              {user?.email ? (
                <span
                  style={{
                    display: "block",
                    marginTop: "5px",
                    fontSize: "12px",
                    opacity: 0.7,
                    overflowWrap:
                      "anywhere",
                  }}
                >
                  {user.email}
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <section
          style={{
            marginTop: "24px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
          }}
        >
          {(
            [
              ["all", "All"],
              ["new", "New"],
              ["in_review", "In Review"],
              ["resolved", "Resolved"],
              ["archived", "Archived"],
            ] as const
          ).map(([value, label]) => {
            const count =
              statusCounts[value];

            const active =
              statusFilter === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setStatusFilter(
                    value,
                  )}
                style={{
                  padding: "16px",
                  border: active
                    ? "1px solid #1E5AA8"
                    : "1px solid #D9DDE1",
                  background: active
                    ? "#EAF2FB"
                    : "#FFFFFF",
                  color: "#111111",
                  textAlign: "left",
                  cursor: "pointer",
                  font: "inherit",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: "#73777C",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform:
                      "uppercase",
                    letterSpacing:
                      "0.06em",
                  }}
                >
                  {label}
                </span>

                <strong
                  style={{
                    display: "block",
                    marginTop: "6px",
                    fontSize: "26px",
                  }}
                >
                  {count}
                </strong>
              </button>
            );
          })}
        </section>

        {errorMessage ? (
          <section
            style={{
              marginTop: "24px",
              padding: "18px 20px",
              border:
                "1px solid #E3B4B4",
              background: "#FFF7F7",
              color: "#8C2F2F",
            }}
          >
            <strong
              style={{
                display: "block",
                marginBottom: "6px",
              }}
            >
              Unable to load feedback
            </strong>

            <p
              style={{
                margin: 0,
                lineHeight: 1.6,
                fontSize: "14px",
              }}
            >
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadFeedback()
              }
              style={{
                marginTop: "14px",
                padding: "10px 14px",
                border:
                  "1px solid #D9DDE1",
                background: "#FFFFFF",
                color: "#3F4348",
                font: "inherit",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </section>
        ) : null}

        {!errorMessage ? (
          <section
            style={{
              marginTop: "24px",
              display: "grid",
              gridTemplateColumns:
                "minmax(320px, 0.85fr) minmax(0, 1.5fr)",
              gap: "16px",
              alignItems: "start",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <span
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      color: "#1E5AA8",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing:
                        "0.08em",
                      textTransform:
                        "uppercase",
                    }}
                  >
                    Submissions
                  </span>

                  <strong
                    style={{
                      fontSize: "18px",
                    }}
                  >
                    {filteredFeedback.length}{" "}
                    {filteredFeedback.length ===
                    1
                      ? "submission"
                      : "submissions"}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void loadFeedback()
                  }
                  disabled={loading}
                  style={{
                    padding: "9px 13px",
                    border:
                      "1px solid #D9DDE1",
                    background: "#FFFFFF",
                    color: "#3F4348",
                    font: "inherit",
                    fontWeight: 700,
                    cursor: loading
                      ? "default"
                      : "pointer",
                    opacity: loading
                      ? 0.6
                      : 1,
                  }}
                >
                  {loading
                    ? "Refreshing..."
                    : "Refresh"}
                </button>
              </div>

              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "#73777C",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  Category
                </span>

                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(
                      event.target
                        .value as
                        | "all"
                        | FeedbackCategory,
                    )
                  }
                  style={{
                    width: "100%",
                    padding:
                      "11px 12px",
                    border:
                      "1px solid #D9DDE1",
                    background:
                      "#FFFFFF",
                    color: "#111111",
                    font: "inherit",
                  }}
                >
                  <option value="all">
                    All categories
                  </option>

                  {Object.entries(
                    categoryLabels,
                  ).map(
                    ([
                      value,
                      label,
                    ]) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {label}
                      </option>
                    ),
                  )}
                </select>
              </label>

              {loading ? (
                <EmptyState
                  title="Loading feedback..."
                  description="Retrieving the latest submissions from the protected leadership service."
                />
              ) : filteredFeedback.length ===
                0 ? (
                <EmptyState
                  title="No feedback found"
                  description="There are no submissions matching the current filters."
                />
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "8px",
                  }}
                >
                  {filteredFeedback.map(
                    (item) => {
                      const active =
                        item.id ===
                        selectedId;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setSelectedId(
                              item.id,
                            )
                          }
                          style={{
                            width: "100%",
                            padding:
                              "16px",
                            border: active
                              ? "1px solid #1E5AA8"
                              : "1px solid #D9DDE1",
                            background:
                              active
                                ? "#F1F6FC"
                                : "#FFFFFF",
                            color:
                              "#111111",
                            textAlign:
                              "left",
                            cursor:
                              "pointer",
                            font: "inherit",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "flex-start",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                minWidth:
                                  0,
                              }}
                            >
                              <strong
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "15px",
                                  lineHeight:
                                    1.4,
                                }}
                              >
                                {
                                  item.subject
                                }
                              </strong>

                              <span
                                style={{
                                  display:
                                    "block",
                                  marginTop:
                                    "4px",
                                  color:
                                    "#73777C",
                                  fontSize:
                                    "13px",
                                }}
                              >
                                {
                                  item.full_name
                                }{" "}
                                ·{" "}
                                {
                                  item.grade_section
                                }
                              </span>
                            </div>

                            <span
                              className={statusClassName(
                                item.status,
                              )}
                              style={{
                                flexShrink:
                                  0,
                                padding:
                                  "5px 8px",
                                border:
                                  "1px solid #D9DDE1",
                                fontSize:
                                  "10px",
                                fontWeight:
                                  700,
                                textTransform:
                                  "uppercase",
                                letterSpacing:
                                  "0.05em",
                              }}
                            >
                              {
                                statusLabels[
                                  item.status
                                ]
                              }
                            </span>
                          </div>

                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "center",
                              gap: "12px",
                              marginTop:
                                "12px",
                              color:
                                "#73777C",
                              fontSize:
                                "12px",
                            }}
                          >
                            <span>
                              {
                                categoryLabels[
                                  item.category
                                ]
                              }
                            </span>

                            <span>
                              {formatDate(
                                item.created_at,
                              )}
                            </span>
                          </div>

                          {item.delegated_to_position ? (
                            <div
                              style={{
                                marginTop:
                                  "9px",
                                color:
                                  "#1E5AA8",
                                fontSize:
                                  "11px",
                                fontWeight:
                                  700,
                              }}
                            >
                              Delegated to{" "}
                              {formatPosition(
                                item.delegated_to_position,
                              )}
                            </div>
                          ) : null}
                        </button>
                      );
                    },
                  )}
                </div>
              )}
            </div>

            <div>
              {selectedFeedback ? (
                <article
                  style={{
                    padding: "28px",
                    border:
                      "1px solid #D9DDE1",
                    background:
                      "#FFFFFF",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-start",
                      gap: "16px",
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display:
                            "block",
                          marginBottom:
                            "7px",
                          color:
                            "#1E5AA8",
                          fontSize:
                            "11px",
                          fontWeight:
                            700,
                          letterSpacing:
                            "0.08em",
                          textTransform:
                            "uppercase",
                        }}
                      >
                        Feedback submission
                      </span>

                      <h2
                        style={{
                          margin: 0,
                          fontSize:
                            "28px",
                          lineHeight:
                            1.2,
                        }}
                      >
                        {
                          selectedFeedback.subject
                        }
                      </h2>
                    </div>

                    <span
                      className={statusClassName(
                        selectedFeedback.status,
                      )}
                      style={{
                        padding:
                          "7px 10px",
                        border:
                          "1px solid #D9DDE1",
                        fontSize:
                          "11px",
                        fontWeight:
                          700,
                        textTransform:
                          "uppercase",
                        letterSpacing:
                          "0.05em",
                      }}
                    >
                      {
                        statusLabels[
                          selectedFeedback.status
                        ]
                      }
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop:
                        "24px",
                      paddingTop:
                        "20px",
                      borderTop:
                        "1px solid #E6E8EA",
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display:
                            "block",
                          marginBottom:
                            "5px",
                          color:
                            "#73777C",
                          fontSize:
                            "11px",
                          fontWeight:
                            700,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.06em",
                        }}
                      >
                        Submitted by
                      </span>

                      <strong>
                        {
                          selectedFeedback.full_name
                        }
                      </strong>

                      <span
                        style={{
                          display:
                            "block",
                          marginTop:
                            "3px",
                          color:
                            "#73777C",
                          fontSize:
                            "13px",
                        }}
                      >
                        {
                          selectedFeedback.grade_section
                        }
                      </span>
                    </div>

                    <div>
                      <span
                        style={{
                          display:
                            "block",
                          marginBottom:
                            "5px",
                          color:
                            "#73777C",
                          fontSize:
                            "11px",
                          fontWeight:
                            700,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.06em",
                        }}
                      >
                        Category
                      </span>

                      <strong>
                        {
                          categoryLabels[
                            selectedFeedback.category
                          ]
                        }
                      </strong>
                    </div>

                    <div>
                      <span
                        style={{
                          display:
                            "block",
                          marginBottom:
                            "5px",
                          color:
                            "#73777C",
                          fontSize:
                            "11px",
                          fontWeight:
                            700,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.06em",
                        }}
                      >
                        Submitted
                      </span>

                      <strong
                        style={{
                          fontSize:
                            "14px",
                        }}
                      >
                        {formatDate(
                          selectedFeedback.created_at,
                        )}
                      </strong>
                    </div>

                    {selectedFeedback.email ? (
                      <div>
                        <span
                          style={{
                            display:
                              "block",
                            marginBottom:
                              "5px",
                            color:
                              "#73777C",
                            fontSize:
                              "11px",
                            fontWeight:
                              700,
                            textTransform:
                              "uppercase",
                            letterSpacing:
                              "0.06em",
                          }}
                        >
                          Email
                        </span>

                        <a
                          href={`mailto:${selectedFeedback.email}`}
                          style={{
                            color:
                              "#1E5AA8",
                            fontSize:
                              "14px",
                            overflowWrap:
                              "anywhere",
                          }}
                        >
                          {
                            selectedFeedback.email
                          }
                        </a>
                      </div>
                    ) : null}
                  </div>

                  <div
                    style={{
                      marginTop:
                        "28px",
                    }}
                  >
                    <span
                      style={{
                        display:
                          "block",
                        marginBottom:
                          "9px",
                        color:
                          "#1E5AA8",
                        fontSize:
                          "11px",
                        fontWeight:
                          700,
                        letterSpacing:
                          "0.08em",
                        textTransform:
                          "uppercase",
                      }}
                    >
                      Message
                    </span>

                    <div
                      style={{
                        padding:
                          "18px",
                        background:
                          "#F7F8F9",
                        border:
                          "1px solid #E6E8EA",
                        whiteSpace:
                          "pre-wrap",
                        lineHeight:
                          1.7,
                        color:
                          "#33373B",
                        fontSize:
                          "14px",
                      }}
                    >
                      {
                        selectedFeedback.message
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop:
                        "24px",
                      display:
                        "grid",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        padding:
                          "14px 16px",
                        border:
                          "1px solid #D9DDE1",
                        background:
                          "#FFFFFF",
                      }}
                    >
                      <strong
                        style={{
                          display:
                            "block",
                          fontSize:
                            "13px",
                        }}
                      >
                        Response requested
                      </strong>

                      <span
                        style={{
                          display:
                            "block",
                          marginTop:
                            "4px",
                          color:
                            "#73777C",
                          fontSize:
                            "13px",
                        }}
                      >
                        {selectedFeedback.request_response
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>

                    <div
                      style={{
                        padding:
                          "14px 16px",
                        border:
                          "1px solid #D9DDE1",
                        background:
                          "#FFFFFF",
                      }}
                    >
                      <strong
                        style={{
                          display:
                            "block",
                          fontSize:
                            "13px",
                        }}
                      >
                        Staff involvement requested
                      </strong>

                      <span
                        style={{
                          display:
                            "block",
                          marginTop:
                            "4px",
                          color:
                            "#73777C",
                          fontSize:
                            "13px",
                        }}
                      >
                        {selectedFeedback.request_staff_involvement
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop:
                        "28px",
                      paddingTop:
                        "20px",
                      borderTop:
                        "1px solid #E6E8EA",
                    }}
                  >
                    <span
                      style={{
                        display:
                          "block",
                        marginBottom:
                          "10px",
                        color:
                          "#1E5AA8",
                        fontSize:
                          "11px",
                        fontWeight:
                          700,
                        letterSpacing:
                          "0.08em",
                        textTransform:
                          "uppercase",
                      }}
                    >
                      Workflow
                    </span>

                    <div
                      style={{
                        display:
                          "grid",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <label
                          htmlFor="feedback-status"
                          style={{
                            display:
                              "block",
                            marginBottom:
                              "6px",
                            color:
                              "#73777C",
                            fontSize:
                              "12px",
                            fontWeight:
                              700,
                          }}
                        >
                          Status
                        </label>

                        <select
                          id="feedback-status"
                          value={
                            selectedFeedback.status
                          }
                          onChange={(
                            event,
                          ) =>
                            void handleStatusChange(
                              event.target
                                .value as FeedbackStatus,
                            )
                          }
                          disabled={
                            actionLoading !==
                            null
                          }
                          style={{
                            width:
                              "100%",
                            padding:
                              "11px 12px",
                            border:
                              "1px solid #D9DDE1",
                            background:
                              "#FFFFFF",
                            color:
                              "#111111",
                            font:
                              "inherit",
                          }}
                        >
                          {Object.entries(
                            statusLabels,
                          ).map(
                            ([
                              value,
                              label,
                            ]) => (
                              <option
                                key={
                                  value
                                }
                                value={
                                  value
                                }
                              >
                                {label}
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="feedback-delegation"
                          style={{
                            display:
                              "block",
                            marginBottom:
                              "6px",
                            color:
                              "#73777C",
                            fontSize:
                              "12px",
                            fontWeight:
                              700,
                          }}
                        >
                          Delegated to
                        </label>

                        <select
                          id="feedback-delegation"
                          value={
                            delegationDraft
                          }
                          onChange={(
                            event,
                          ) =>
                            void handleDelegationChange(
                              event.target
                                .value as
                                | LeadershipPosition
                                | "",
                            )
                          }
                          disabled={
                            actionLoading !==
                            null
                          }
                          style={{
                            width:
                              "100%",
                            padding:
                              "11px 12px",
                            border:
                              "1px solid #D9DDE1",
                            background:
                              "#FFFFFF",
                            color:
                              "#111111",
                            font:
                              "inherit",
                          }}
                        >
                          <option value="">
                            Not delegated
                          </option>

                          {leadershipPositions.map(
                            (
                              leadershipPosition,
                            ) => (
                              <option
                                key={
                                  leadershipPosition
                                }
                                value={
                                  leadershipPosition
                                }
                              >
                                {formatPosition(
                                  leadershipPosition,
                                )}
                              </option>
                            ),
                          )}
                        </select>

                        {selectedFeedback.delegated_at ? (
                          <span
                            style={{
                              display:
                                "block",
                              marginTop:
                                "6px",
                              color:
                                "#73777C",
                              fontSize:
                                "12px",
                            }}
                          >
                            Delegated{" "}
                            {formatDate(
                              selectedFeedback.delegated_at,
                            )}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop:
                        "28px",
                      paddingTop:
                        "20px",
                      borderTop:
                        "1px solid #E6E8EA",
                    }}
                  >
                    <span
                      style={{
                        display:
                          "block",
                        marginBottom:
                          "9px",
                        color:
                          "#1E5AA8",
                        fontSize:
                          "11px",
                        fontWeight:
                          700,
                        letterSpacing:
                          "0.08em",
                        textTransform:
                          "uppercase",
                      }}
                    >
                      Internal notes
                    </span>

                    <textarea
                      value={
                        notesDraft
                      }
                      onChange={(
                        event,
                      ) =>
                        setNotesDraft(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Add private notes for the leadership team..."
                      rows={5}
                      disabled={
                        actionLoading !==
                        null
                      }
                      style={{
                        width:
                          "100%",
                        boxSizing:
                          "border-box",
                        padding:
                          "13px 14px",
                        border:
                          "1px solid #D9DDE1",
                        background:
                          "#FFFFFF",
                        color:
                          "#111111",
                        font:
                          "inherit",
                        lineHeight:
                          1.6,
                        resize:
                          "vertical",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        void handleSaveNotes()
                      }
                      disabled={
                        actionLoading !==
                        null
                      }
                      style={{
                        marginTop:
                          "10px",
                        padding:
                          "10px 15px",
                        border:
                          "1px solid #123B6D",
                        background:
                          "#123B6D",
                        color:
                          "#FFFFFF",
                        font:
                          "inherit",
                        fontWeight:
                          700,
                        cursor:
                          actionLoading !==
                          null
                            ? "default"
                            : "pointer",
                        opacity:
                          actionLoading !==
                          null
                            ? 0.6
                            : 1,
                      }}
                    >
                      {actionLoading ===
                      "update_notes"
                        ? "Saving..."
                        : "Save notes"}
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop:
                        "28px",
                      paddingTop:
                        "20px",
                      borderTop:
                        "1px solid #E6E8EA",
                    }}
                  >
                    <span
                      style={{
                        display:
                          "block",
                        marginBottom:
                          "9px",
                        color:
                          "#1E5AA8",
                        fontSize:
                          "11px",
                        fontWeight:
                          700,
                        letterSpacing:
                          "0.08em",
                        textTransform:
                          "uppercase",
                      }}
                    >
                      Response
                    </span>

                    <p
                      style={{
                        margin:
                          "0 0 10px",
                        color:
                          "#73777C",
                        fontSize:
                          "12px",
                        lineHeight:
                          1.5,
                      }}
                    >
                      Saving this response records it on the
                      feedback item. It does not currently send
                      an email to the student.
                    </p>

                    <textarea
                      value={
                        responseDraft
                      }
                      onChange={(
                        event,
                      ) =>
                        setResponseDraft(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Write the leadership response..."
                      rows={7}
                      disabled={
                        actionLoading !==
                        null
                      }
                      style={{
                        width:
                          "100%",
                        boxSizing:
                          "border-box",
                        padding:
                          "13px 14px",
                        border:
                          "1px solid #D9DDE1",
                        background:
                          "#FFFFFF",
                        color:
                          "#111111",
                        font:
                          "inherit",
                        lineHeight:
                          1.6,
                        resize:
                          "vertical",
                      }}
                    />

                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap:
                          "12px",
                        marginTop:
                          "10px",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <span
                        style={{
                          color:
                            "#73777C",
                          fontSize:
                            "12px",
                        }}
                      >
                        {selectedFeedback.response_sent_at
                          ? `Saved ${formatDate(selectedFeedback.response_sent_at)}`
                          : "No response saved yet."}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          void handleSaveResponse()
                        }
                        disabled={
                          actionLoading !==
                          null
                        }
                        style={{
                          padding:
                            "10px 15px",
                          border:
                            "1px solid #123B6D",
                          background:
                            "#123B6D",
                          color:
                            "#FFFFFF",
                          font:
                            "inherit",
                          fontWeight:
                            700,
                          cursor:
                            actionLoading !==
                            null
                              ? "default"
                              : "pointer",
                          opacity:
                            actionLoading !==
                            null
                              ? 0.6
                              : 1,
                        }}
                      >
                        {actionLoading ===
                        "save_response"
                          ? "Saving..."
                          : selectedFeedback.response
                            ? "Update response"
                            : "Save response"}
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop:
                        "28px",
                      paddingTop:
                        "20px",
                      borderTop:
                        "1px solid #E6E8EA",
                    }}
                  >
                    <span
                      style={{
                        display:
                          "block",
                        marginBottom:
                          "9px",
                        color:
                          "#1E5AA8",
                        fontSize:
                          "11px",
                        fontWeight:
                          700,
                        letterSpacing:
                          "0.08em",
                        textTransform:
                          "uppercase",
                      }}
                    >
                      Attachments
                    </span>

                    {selectedFeedback.attachments.length ===
                    0 ? (
                      <p
                        style={{
                          margin: 0,
                          color:
                            "#73777C",
                          fontSize:
                            "14px",
                        }}
                      >
                        No attachments were
                        submitted.
                      </p>
                    ) : (
                      <div
                        style={{
                          display:
                            "grid",
                          gap: "8px",
                        }}
                      >
                        {selectedFeedback.attachments.map(
                          (attachment) => {
                            const attachmentLoading =
                              actionLoading ===
                              `attachment:${attachment.id}`;

                            return (
                              <div
                                key={
                                  attachment.id
                                }
                                style={{
                                  display:
                                    "flex",
                                  justifyContent:
                                    "space-between",
                                  alignItems:
                                    "center",
                                  gap:
                                    "12px",
                                  padding:
                                    "12px 14px",
                                  border:
                                    "1px solid #D9DDE1",
                                  background:
                                    "#FFFFFF",
                                }}
                              >
                                <div
                                  style={{
                                    minWidth:
                                      0,
                                  }}
                                >
                                  <strong
                                    style={{
                                      display:
                                        "block",
                                      fontSize:
                                        "13px",
                                      overflowWrap:
                                        "anywhere",
                                    }}
                                  >
                                    {
                                      attachment.file_name
                                    }
                                  </strong>

                                  <span
                                    style={{
                                      display:
                                        "block",
                                      marginTop:
                                        "3px",
                                      color:
                                        "#73777C",
                                      fontSize:
                                        "12px",
                                    }}
                                  >
                                    {formatFileSize(
                                      attachment.file_size,
                                    )}{" "}
                                    ·{" "}
                                    {
                                      attachment.mime_type
                                    }
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    void handleAttachmentOpen(
                                      attachment,
                                    )
                                  }
                                  disabled={
                                    actionLoading !==
                                    null
                                  }
                                  style={{
                                    flexShrink:
                                      0,
                                    padding:
                                      "8px 11px",
                                    border:
                                      "1px solid #D9DDE1",
                                    background:
                                      "#F7F8F9",
                                    color:
                                      "#123B6D",
                                    font:
                                      "inherit",
                                    fontSize:
                                      "12px",
                                    fontWeight:
                                      700,
                                    cursor:
                                      actionLoading !==
                                      null
                                        ? "default"
                                        : "pointer",
                                    opacity:
                                      actionLoading !==
                                      null
                                        ? 0.6
                                        : 1,
                                  }}
                                >
                                  {attachmentLoading
                                    ? "Opening..."
                                    : "Open securely"}
                                </button>
                              </div>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>

                  {actionMessage ||
                  actionError ? (
                    <div
                      style={{
                        marginTop:
                          "20px",
                      }}
                    >
                      {actionMessage ? (
                        <ActionMessage
                          message={
                            actionMessage
                          }
                        />
                      ) : null}

                      {actionError ? (
                        <ActionMessage
                          message={
                            actionError
                          }
                          error
                        />
                      ) : null}
                    </div>
                  ) : null}
                </article>
              ) : (
                <EmptyState
                  title="Select a submission"
                  description="Choose a feedback submission from the list to view its full details."
                />
              )}
            </div>
          </section>
        ) : null}

        <section
          style={{
            marginTop: "32px",
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
            to="/portal"
            style={{
              color: "#3F4348",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            ← Back to Portal
          </NavLink>

          <span
            style={{
              color: "#73777C",
              fontSize: "12px",
            }}
          >
            Protected leadership workspace
          </span>
        </section>
      </div>
    </main>
  );
}