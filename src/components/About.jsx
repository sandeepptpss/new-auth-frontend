// src/components/About.jsx
import React from "react";
import { Card, Tag, Timeline } from "antd";
import {
  CodeOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const AboutUs = () => {
  const skills = [
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Shopify",
    "WordPress",
    "Tailwind CSS",
    "Ant Design",
    "JavaScript",
    "REST APIs",
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs uppercase tracking-wider mb-2">
            Developer Bio
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">About Me</h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto mt-2">
            Passionate full-stack developer specializing in Shopify, WordPress, React, and modern web applications.
          </p>
        </div>

        <Card className="shadow-sm border border-slate-200/80 rounded-2xl p-6">
          <div className="space-y-4 text-slate-700 leading-relaxed text-base">
            <p>
              Hi, I'm <strong className="text-slate-900 font-bold">Sandeep Paswan</strong>, a passionate developer with expertise in Shopify development, WordPress, and a wide array of web technologies. I specialize in building robust and scalable e-commerce solutions and dynamic web applications.
            </p>
            <p>
              With years of experience in building custom Shopify themes, integrating apps, and optimizing store performance, I have a deep understanding of creating user-friendly, visually appealing, and high-converting online platforms.
            </p>
            <p>
              In addition to CMS solutions, I excel in <strong className="text-indigo-600">React.js</strong> for building dynamic, single-page applications, backed by <strong className="text-indigo-600">Node.js</strong> for server-side APIs and logic.
            </p>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <CodeOutlined className="text-indigo-600" /> Core Skills & Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Tag key={index} color="indigo" className="px-3 py-1 text-sm font-semibold rounded-md">
                  {skill}
                </Tag>
              ))}
            </div>
          </div>
        </Card>

        <Card className="shadow-sm border border-slate-200/80 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <RocketOutlined className="text-indigo-600" /> Professional Experience Timeline
          </h3>
          <Timeline
            items={[
              {
                color: "green",
                children: (
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-0">Full-Stack Application Development</h4>
                    <p className="text-slate-500 text-xs mb-0">MERN Stack, Ant Design, Tailwind CSS integration</p>
                  </div>
                ),
              },
              {
                color: "blue",
                children: (
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-0">Shopify & E-Commerce Expert</h4>
                    <p className="text-slate-500 text-xs mb-0">Theme customization, custom app integration & performance optimization</p>
                  </div>
                ),
              },
              {
                color: "purple",
                children: (
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-0">WordPress Development</h4>
                    <p className="text-slate-500 text-xs mb-0">Plugin development, custom PHP themes & security enhancements</p>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default AboutUs;