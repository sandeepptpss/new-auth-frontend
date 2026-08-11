// src/pages/admin/Calendar.jsx
import React, { useState } from "react";
import { Calendar as AntCalendar, Card, Tag } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { PageHeader } from "../../components/admin/ui";

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const onSelect = (newValue) => {
    setSelectedDate(newValue);
  };

  return (
    <div>
      <PageHeader title="Calendar" subtitle="Schedule and view events." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="shadow-sm border border-slate-100 lg:col-span-2">
          <AntCalendar value={selectedDate} onSelect={onSelect} />
        </Card>

        <Card className="shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <CalendarOutlined className="text-indigo-600 text-xl" />
            <h3 className="font-bold text-slate-800 text-base mb-0">Date Details</h3>
          </div>

          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            Selected Date
          </p>
          <Tag color="indigo" className="text-sm px-3 py-1 font-semibold rounded-md mb-4">
            {selectedDate.format("MMMM D, YYYY")}
          </Tag>

          <div className="border-t border-slate-100 pt-4 mt-2">
            <p className="text-slate-500 text-sm">
              Event scheduling and sync will be integrated in the next release.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MyCalendar;
