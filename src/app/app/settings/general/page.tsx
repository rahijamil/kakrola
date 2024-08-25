"use client";

import { useState } from "react";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { Select } from "@/components/ui/select";

export default function GeneralSettingsPage() {
  const [language, setLanguage] = useState("English");
  const [homeView, setHomeView] = useState("Today");
  const [timeZone, setTimeZone] = useState("Asia/Dhaka");
  const [timeFormat, setTimeFormat] = useState("13:00");
  const [dateFormat, setDateFormat] = useState("DD-MM-YYYY");
  const [weekStart, setWeekStart] = useState("Monday");
  const [nextWeek, setNextWeek] = useState("Monday");
  const [weekend, setWeekend] = useState("Saturday");
  const [smartDateRecognition, setSmartDateRecognition] = useState(true);
  const [resetSubTasks, setResetSubTasks] = useState(true);

  return (
    <div className="space-y-6">
      <section className="space-y-4 max-w-sm">
        <h2 className="text-2xl font-bold">General</h2>

        <div>
          <label className="block font-bold">Language</label>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            {/* Add more language options as needed */}
          </Select>
        </div>

        <div>
          <label className="block font-bold">Home view</label>
          <Select
            value={homeView}
            onChange={(e) => setHomeView(e.target.value)}
          >
            <option value="Today">Today</option>
            {/* Add more home view options as needed */}
          </Select>
        </div>
      </section>

      <div className="h-[1px] bg-text-200"></div>

      <section className="space-y-4 max-w-sm">
        <h2 className="text-2xl font-bold">Date & time</h2>

        <div>
          <label className="block font-bold">Time zone</label>
          <Select
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
          >
            <option value="Asia/Dhaka">Asia/Dhaka</option>
            {/* Add more time zone options as needed */}
          </Select>
        </div>

        <div>
          <label className="block font-bold">Time format</label>
          <Select
            value={timeFormat}
            onChange={(e) => setTimeFormat(e.target.value)}
          >
            <option value="13:00">13:00</option>
            <option value="01:00 PM">01:00 PM</option>
          </Select>
        </div>

        <div>
          <label className="block font-bold">Date format</label>
          <Select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
          >
            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            <option value="MM-DD-YYYY">MM-DD-YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </Select>
        </div>

        <div>
          <label className="block font-bold">Week start</label>
          <Select
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
          >
            <option value="Monday">Monday</option>
            <option value="Sunday">Sunday</option>
          </Select>
        </div>

        <div>
          <label className="block font-bold">Next week</label>
          <Select
            value={nextWeek}
            onChange={(e) => setNextWeek(e.target.value)}
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
          </Select>
        </div>

        <div>
          <label className="block font-bold">Weekend</label>
          <Select
            value={weekend}
            onChange={(e) => setWeekend(e.target.value)}
          >
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </Select>
        </div>
      </section>

      <div className="h-[1px] bg-text-200"></div>

      <section className="space-y-4 max-w-sm">
        <h2 className="text-2xl font-bold">Smart date recognition</h2>
        <div>
          <ToggleSwitch
            id="smart-date-recognition"
            checked={smartDateRecognition}
            onCheckedChange={() =>
              setSmartDateRecognition(!smartDateRecognition)
            }
          />
        </div>
      </section>

      <div className="h-[1px] bg-text-200"></div>

      <section className="space-y-4 max-w-sm">
        <h2 className="text-2xl font-bold">Reset sub-tasks</h2>
        <div>
          <ToggleSwitch
            id="reset-sub-tasks"
            checked={resetSubTasks}
            onCheckedChange={() => setResetSubTasks(!resetSubTasks)}
          />
        </div>
      </section>
    </div>
  );
}
