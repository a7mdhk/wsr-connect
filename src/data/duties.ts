export const schoolDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

export type SchoolDay = (typeof schoolDays)[number];

export const breakPeriods = ["Break 1", "Break 2"] as const;

export type BreakPeriod = (typeof breakPeriods)[number];

export type DutyArea = "Downstairs" | "Upstairs";

export interface BreakDutyPost {
  location: string;
  role?: string;
  assignments: Partial<Record<SchoolDay, string[]>>;
}

function acrossDays(
  days: readonly SchoolDay[],
  people: string[],
): Partial<Record<SchoolDay, string[]>> {
  return Object.fromEntries(
    days.map((day) => [day, [...people]]),
  ) as Partial<Record<SchoolDay, string[]>>;
}

const mondayToThursday = schoolDays.slice(
  0,
  4,
) as readonly SchoolDay[];

export const approvedVolunteers = {
  girls: [
    "Yusra Faryal (12G2)",
    "Haania Sajid (12G1)",
    "Yassmin Beheiry (12G1)",
    "Mahroo Khan (11G1)",
    "Wareesha Zaib (11G1)",
  ],
  boys: [
    "Rayan (12B2)",
    "Karam (12B1)",
    "Yagiz (12B2)",
    "Hassan (12B2)",
  ],
};

export const coverageInstructions =
  "In case you are absent or unable to complete your assigned duty, let us know a day prior and coordinate with another member of the SRC who is free to cover for you. If there are no SRC members available, you may coordinate with one of the approved volunteers. Let us know in advance if you will not be able to do your duty and inform us who will be covering for you.";

export const downstairsBreakDuties: Record<
  BreakPeriod,
  BreakDutyPost[]
> = {
  "Break 1": [
    {
      location: "EXIT 1 (Near Gate 6)",
      role: "Students are not permitted to use this exit to go up, unless G11/12. Ensure students are not loitering in the stairwell. Allow students to go up if they are coming from PE. Allow students to go up if they have a SIGNED note from a teacher.",
      assignments: acrossDays(mondayToThursday, ["Ibrahim"]),
    },
    {
      location: "EXIT 2 (Near Boys Canteen)",
      assignments: acrossDays(mondayToThursday, ["M.H"]),
    },
    {
      location: "EXIT 3 (Near Girls Canteen)",
      assignments: acrossDays(mondayToThursday, ["Tiara"]),
    },
    {
      location: "EXIT 4 (Near Cricket Field)",
      assignments: acrossDays(mondayToThursday, ["Ayesha"]),
    },
    {
      location: "Staircase Near Quadrangle",
      assignments: acrossDays(mondayToThursday, ["Hayk"]),
    },
    {
      location: "Staircase Lower Shaded Area",
      assignments: acrossDays(mondayToThursday, [
        "Mariam Hamadeh",
      ]),
    },
    {
      location: "Intersection (Front of MPH)",
      role: "Ensure students are not loitering.",
      assignments: acrossDays(mondayToThursday, ["Joel"]),
    },
    {
      location: "Boys Washroom",
      role: "Only four students in the washroom at a time. Ensure students do not loiter in the washroom for longer than two minutes.",
      assignments: acrossDays(mondayToThursday, [
        "Hamzah (V)",
      ]),
    },
    {
      location: "Girls Washroom",
      assignments: acrossDays(mondayToThursday, ["Zimmal"]),
    },
    {
      location: "MPH Entrance",
      role: "Only allow students for the washroom in, four at a time. Students cannot loiter here.",
      assignments: acrossDays(mondayToThursday, ["Safaa"]),
    },
    {
      location: "Upper Shaded Area",
      role: "Patrol area and ensure safety of students. Once break ends, ensure all students leave in a timely manner through the correct exits.",
      assignments: acrossDays(mondayToThursday, ["Misk"]),
    },
    {
      location: "Lower Shaded Area",
      assignments: acrossDays(mondayToThursday, ["Praganya"]),
    },
    {
      location: "Girls Canteen",
      role: "Ensure students are not loitering in the walkway in front of the canteen. Ensure all students have left after break ends.",
      assignments: acrossDays(mondayToThursday, ["Khalisa"]),
    },
    {
      location: "Boys Canteen",
      assignments: acrossDays(mondayToThursday, ["Jad"]),
    },
    {
      location: "Quadrangle",
      role: "Patrol area and ensure safety of students. Once break ends, ensure all students leave in a timely manner through the correct exits.",
      assignments: acrossDays(mondayToThursday, [
        "Bukhari",
        "Shayan",
      ]),
    },
    {
      location: "Field",
      assignments: acrossDays(mondayToThursday, [
        "Sinan",
        "Wesley",
      ]),
    },
    {
      location: "Basket Ball Court",
      role: "Patrol area and ensure safety of students. Once break ends, ensure all students leave in a timely manner through the correct exits.",
      assignments: acrossDays(mondayToThursday, [
        "Innaya",
        "Sara Abutalib",
      ]),
    },
    {
      location: "Cricket Net",
      assignments: acrossDays(mondayToThursday, [
        "Devanshi",
      ]),
    },
    {
      location: "Upper Shaded Area",
      role: "Patrol area and ensure safety of students. Once break ends, ensure all students leave in a timely manner through the correct exits.",
      assignments: acrossDays(mondayToThursday, [
        "Misk",
        "Zenia",
      ]),
    },
    {
      location: "Lower Shaded Area",
      assignments: acrossDays(mondayToThursday, [
        "Maryam Hassan",
        "Reema",
      ]),
    },
  ],

  "Break 2": [
    {
      location: "EXIT 1 (Near Gate 6)",
      role: "Students are not permitted to use this exit to go up, unless G11/12. Ensure students are not loitering in the stairwell. Allow students to go up if they are coming from PE. Allow students to go up if they have a SIGNED note from a teacher.",
      assignments: acrossDays(mondayToThursday, ["Sanad"]),
    },
    {
      location: "EXIT 2 (Near Boys Canteen)",
      assignments: acrossDays(mondayToThursday, ["Adney"]),
    },
    {
      location: "EXIT 3 (Near Girls Canteen)",
      assignments: acrossDays(mondayToThursday, [
        "Pragnaya",
      ]),
    },
    {
      location: "EXIT 4 (Near Cricket Field)",
      assignments: acrossDays(mondayToThursday, ["Mayan"]),
    },
    {
      location: "Staircase Near Quadrangle",
      assignments: acrossDays(mondayToThursday, ["Moaz"]),
    },
    {
      location: "Staircase Lower Shaded Area",
      assignments: acrossDays(mondayToThursday, ["Sharlin"]),
    },
    {
      location: "Intersection (Front of MPH)",
      role: "Ensure students are not loitering.",
      assignments: acrossDays(mondayToThursday, [
        "Saad K (V)",
      ]),
    },
    {
      location: "Boys Washroom",
      role: "Only four students in the washroom at a time. Ensure students do not loiter in the washroom for longer than two minutes.",
      assignments: acrossDays(mondayToThursday, [
        "Hamzah (V)",
      ]),
    },
    {
      location: "Girls Washroom",
      assignments: acrossDays(mondayToThursday, ["Zaheen"]),
    },
    {
      location: "MPH Entrance",
      role: "Only allow students for the washroom in, four at a time. Students cannot loiter here.",
      assignments: acrossDays(mondayToThursday, ["Retaj"]),
    },
    {
      location: "Upper Shaded Area",
      role: "Patrol area and ensure safety of students. Once break ends, ensure all students leave in a timely manner through the correct exits.",
      assignments: acrossDays(mondayToThursday, [
        "Fayrouz",
      ]),
    },
    {
      location: "Lower Shaded Area",
      assignments: acrossDays(mondayToThursday, ["Faryal"]),
    },
    {
      location: "Girls Canteen",
      role: "Ensure students are not loitering in the walkway in front of the canteen. Ensure all students have left after break ends.",
      assignments: acrossDays(mondayToThursday, ["Renoaa"]),
    },
    {
      location: "Boys Canteen",
      assignments: acrossDays(mondayToThursday, ["Omar"]),
    },
    {
      location: "Quadrangle",
      role: "Patrol area and ensure safety of students. Once break ends, ensure all students leave in a timely manner through the correct exits.",
      assignments: acrossDays(mondayToThursday, [
        "Yousuf.H",
        "Habibur",
      ]),
    },
    {
      location: "Field",
      assignments: acrossDays(mondayToThursday, [
        "Jamal",
        "Seif Ahmed",
      ]),
    },
    {
      location: "Basket Ball Court",
      role: "Patrol area and ensure safety of students. Once break ends, ensure all students leave in a timely manner through the correct exits.",
      assignments: acrossDays(mondayToThursday, [
        "Aziza",
        "Balqees",
      ]),
    },
    {
      location: "Cricket Net",
      assignments: acrossDays(mondayToThursday, ["Nourin"]),
    },
    {
      location: "Upper Shaded Area",
      role: "Patrol area and ensure safety of students. Once break ends, ensure all students leave in a timely manner through the correct exits.",
      assignments: acrossDays(mondayToThursday, [
        "Aaira",
        "Anaam",
      ]),
    },
    {
      location: "Lower Shaded Area",
      assignments: {
        Monday: ["Elena", "Fatma"],
        Tuesday: ["Elena", "Reema"],
        Wednesday: ["Elena", "Reema"],
        Thursday: ["Elena", "Reema"],
      },
    },
  ],
};

export const upstairsBreakDuties: Record<
  BreakPeriod,
  BreakDutyPost[]
> = {
  "Break 1": [
    {
      location: "Washroom New Building Corridor (Girls)",
      role: "Students need to have a hall pass to use the washroom. Ensure groups of students do not stay in the washroom for a long time. After the bell has rung, clear the washroom and ensure students have returned to class.",
      assignments: acrossDays(schoolDays, []),
    },
    {
      location: "Washroom Middle Corridor (Girls)",
      assignments: acrossDays(schoolDays, ["Devanshi"]),
    },
    {
      location: "Washroom Old Building Corridor (Girls)",
      assignments: acrossDays(schoolDays, ["Sara Sen"]),
    },
    {
      location: "Washroom New Building Corridor (Boys)",
      assignments: acrossDays(schoolDays, ["Sanad"]),
    },
    {
      location: "Washroom Middle Corridor (Boys)",
      assignments: acrossDays(schoolDays, ["Saad (V)"]),
    },
    {
      location: "Washroom Old Building Corridor (Boys)",
      assignments: acrossDays(schoolDays, ["Y.H"]),
    },
    {
      location: "Library Exit (Boys)",
      role: "Restrict students from passing.",
      assignments: acrossDays(schoolDays, [
        "Hamzah (V)",
      ]),
    },
    {
      location: "New Building Exit (Boys)",
      role: "Restrict students from going downstairs.",
      assignments: acrossDays(schoolDays, ["Moaz"]),
    },
    {
      location: "Exit Near to Ms. Remya's Office",
      assignments: acrossDays(schoolDays, ["Hayk"]),
    },
    {
      location: "Exit Near to G11B Common Room",
      assignments: acrossDays(schoolDays, ["Wesley"]),
    },
    {
      location: "Exit 3 (Near Miss Hassina's Office)",
      assignments: acrossDays(schoolDays, [
        "Maryam Hassan",
      ]),
    },
    {
      location: "Near Miss Zipporah's Office",
      assignments: acrossDays(schoolDays, ["Mayan"]),
    },
    {
      location: "Science Lab Corridor (Girls)",
      role: "Ensure everyone entering the area has a hall pass and is there for a solid reason such as meeting a teacher and not loitering.",
      assignments: acrossDays(schoolDays, ["Sharlin"]),
    },
  ],

  "Break 2": [
    {
      location: "Washroom New Building Corridor (Girls)",
      role: "Students need to have a hall pass to use the washroom. Ensure groups of students do not stay in the washroom for a long time. After the bell has rung, clear the washroom and ensure students have returned to class.",
      assignments: acrossDays(schoolDays, ["Zaheen"]),
    },
    {
      location: "Washroom Middle Corridor (Girls)",
      assignments: acrossDays(schoolDays, ["Sara Sen"]),
    },
    {
      location: "Washroom Old Building Corridor (Girls)",
      assignments: acrossDays(schoolDays, ["Fayrouz"]),
    },
    {
      location: "Washroom New Building Corridor (Boys)",
      assignments: acrossDays(schoolDays, ["Joel"]),
    },
    {
      location: "Washroom Middle Corridor (Boys)",
      assignments: acrossDays(schoolDays, ["Shayyan"]),
    },
    {
      location: "Washroom Old Building Corridor (Boys)",
      assignments: acrossDays(schoolDays, ["M.H"]),
    },
    {
      location: "Library Exit (Boys)",
      role: "Restrict students from passing.",
      assignments: acrossDays(schoolDays, [
        "Hamzah (V)",
      ]),
    },
    {
      location: "New Building Exit (Boys)",
      role: "Restrict students from going downstairs.",
      assignments: acrossDays(schoolDays, ["Sinan"]),
    },
    {
      location: "Exit Near to Ms. Remya's Office",
      assignments: acrossDays(schoolDays, ["Jad"]),
    },
    {
      location: "Exit Near to G11B Common Room",
      assignments: acrossDays(schoolDays, ["Jamal"]),
    },
    {
      location: "Exit 3 (Near Miss Hassina's Office)",
      assignments: acrossDays(schoolDays, ["Faryal"]),
    },
    {
      location: "Near Miss Nourhane's Office",
      assignments: acrossDays(schoolDays, ["Renoaa"]),
    },
    {
      location: "Science Lab Corridor (Girls)",
      role: "Ensure everyone entering the area has a hall pass and is there for a solid reason such as meeting a teacher and not loitering.",
      assignments: acrossDays(schoolDays, ["Aziza"]),
    },
  ],
};

export interface DutyTimeSlot {
  label: string;
  time: string;
}

export const transitionDutyTimes: DutyTimeSlot[] = [
  { label: "Lesson 1", time: "07:40" },
  { label: "Registration", time: "08:25" },
  { label: "Lesson 2", time: "08:40" },
  { label: "Lesson 3", time: "09:30" },
  { label: "Lesson 4", time: "10:40" },
  { label: "Lesson 5", time: "11:25" },
  { label: "Lesson 6", time: "12:40" },
  { label: "Lesson 7", time: "01:25" },
];

export const fridayTransitionTimes = transitionDutyTimes.slice(0, 5);

export const transitionDutyLocations = [
  "New Building Corridor",
  "Middle Corridor",
  "Old Building Corridor",
];

export const transitionDutyRole =
  "Begin your duty at your assigned location at the stated time. Ensure that everyone is walking on their right and actively moving to lessons. Do not let students stand in the corridors and block the way. Assist students in finding their classrooms and teachers if needed. Ensure everyone is getting to class on time.";

export const corridorDutyLocations = [
  "New Building Corridor",
  "Old Building Corridor",
];

export const corridorDutyRole =
  "Once you have completed transition duty, there will be a single desk in the middle of the old building corridor and another one in the middle of the new building corridor directly facing each other. You may use that seat to carry on with your studies while on corridor duty. You must ensure that the corridor you are assigned to does not have any students loitering about; anyone outside of class has a hall pass. Make sure students are not taking too long or wasting time in the toilets. Ensure that there is a teacher present in every classroom with students and that nobody is sitting in an empty classroom alone or skipping their classes. The desks are strategically placed to allow the students on duty to monitor the corridor they are in as well as the middle corridor.";

export const dutyDataStatus = {
  transition: {
    girls: "No student assignments were populated in the supplied spreadsheet.",
    boys: "No student assignments were populated in the supplied spreadsheet.",
  },
  corridor: {
    girls: "No student assignments were populated in the supplied spreadsheet.",
    boys: "No student assignments were populated in the supplied spreadsheet.",
  },
};