import Job from "../models/job.model.js";

export const createJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    user: req.user
  });

  res.json(job);
};

export const getJobs = async (req, res) => {
  const jobs = await Job.find({ user: req.user });
  res.json(jobs);
};

export const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) return res.status(404).json({ message: "Job not found" });

  job.status = req.body.status || job.status;
  await job.save();

  res.json(job);
};

export const deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Job deleted" });
};