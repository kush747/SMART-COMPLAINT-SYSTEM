import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import { complaintService } from "../services/complaintService";
import { userService } from "../services/userService";
import { STATUSES, humanize } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

export default function ComplaintDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");

  const load = () => complaintService.get(id).then(setComplaint).catch((err) => setError(err.response?.data?.message || err.message));

  useEffect(() => {
    load();
    if (user.role === "ADMIN") userService.list({ role: "OFFICER", size: 100 }).then((page) => setOfficers(page.content || []));
  }, [id]);

  const support = async () => {
    complaint.supportedByCurrentUser ? await complaintService.removeSupport(id) : await complaintService.support(id);
    load();
  };

  const changeStatus = async (status) => {
    await complaintService.updateStatus(id, status);
    load();
  };

  const assign = async (officerId) => {
    if (officerId) {
      await complaintService.assignOfficer(id, Number(officerId));
      load();
    }
  };

  const addRemark = async (event) => {
    event.preventDefault();
    await complaintService.addRemark(id, remark);
    setRemark("");
    load();
  };

  return (
    <AppLayout>
      {!complaint ? error ? <p className="text-rose-700">{error}</p> : <LoadingSpinner /> : (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <article className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">{complaint.title}</h1>
                <p className="mt-1 text-sm text-slate-500">{humanize(complaint.category)} in {complaint.location}</p>
              </div>
              <StatusBadge status={complaint.status} />
            </div>
            {complaint.imageUrl && <img className="mt-5 max-h-96 w-full rounded-lg object-cover" src={complaint.imageUrl} alt={complaint.title} />}
            <p className="mt-5 whitespace-pre-wrap text-slate-700">{complaint.description}</p>
            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-slate-500">Created by</dt><dd className="font-medium">{complaint.createdBy?.fullName}</dd></div>
              <div><dt className="text-slate-500">Assigned officer</dt><dd className="font-medium">{complaint.assignedOfficer?.fullName || "Unassigned"}</dd></div>
              <div><dt className="text-slate-500">Supports</dt><dd className="font-medium">{complaint.supportCount}</dd></div>
            </dl>
            {user.role === "USER" && (
              <div className="mt-6 flex gap-3">
                <button onClick={support} className="rounded bg-blue-500 px-4 py-2 font-semibold text-black">{complaint.supportedByCurrentUser ? "Remove Support" : "Support Complaint"}</button>
                {complaint.createdBy?.id === user.id && <Link to={`/complaints/${id}/edit`} className="rounded border border-slate-300 px-4 py-2 font-semibold">Edit</Link>}
              </div>
            )}
          </article>
          <aside className="space-y-6">
            {user.role === "ADMIN" && (
              <section className="rounded-lg bg-white p-5 shadow-sm">
                <h2 className="font-semibold">Assign Officer</h2>
                <select onChange={(e) => assign(e.target.value)} defaultValue="" className="mt-3 w-full rounded border border-slate-300 px-3 py-2 focus-ring">
                  <option value="">Select officer</option>
                  {officers.map((officer) => <option key={officer.id} value={officer.id}>{officer.fullName}</option>)}
                </select>
              </section>
            )}
            {user.role === "OFFICER" && (

              <>
              {/* Complainant Details */}
    <section className="rounded-lg bg-white p-5 shadow-sm">
      <h2 className="font-semibold mb-3">Complainant Details</h2>
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-slate-500">Name</dt>
          <dd className="font-medium">{complaint.createdBy?.fullName}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Email</dt>
          <dd className="font-medium">{complaint.createdBy?.email}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Phone</dt>
          <dd className="font-medium">{complaint.createdBy?.phone || "Not provided"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Address</dt>
          <dd className="font-medium">{complaint.createdBy?.address || "Not provided"}</dd>
        </div>
      </dl>
    </section>

    
              <section className="rounded-lg bg-white p-5 shadow-sm">
                <h2 className="font-semibold">Officer Actions</h2>
                <select value={complaint.status} onChange={(e) => changeStatus(e.target.value)} className="mt-3 w-full rounded border border-slate-300 px-3 py-2 focus-ring">
                  {STATUSES.map((status) => <option key={status} value={status}>{humanize(status)}</option>)}
                </select>
                <form onSubmit={addRemark} className="mt-4">
                  <textarea className="min-h-24 w-full rounded border border-slate-300 px-3 py-2 focus-ring" value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Add remark" required />
                  <button className="mt-2 rounded bg-blue-500 px-4 py-2 font-semibold text-black  ">Add Remark</button>
                </form>
              </section>


              </>



            )}
            <section className="rounded-lg bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Remarks</h2>
              <div className="mt-3 space-y-3">
                {complaint.remarks?.length ? complaint.remarks.map((item) => (
                  <div key={item.id} className="rounded border border-slate-200 p-3 text-sm">
                    <p>{item.comment}</p>
                    <p className="mt-2 text-xs text-slate-500">{item.officer?.fullName}</p>
                  </div>
                )) : <p className="text-sm text-slate-500">No remarks yet.</p>}
              </div>
            </section>
          </aside>
        </div>
      )}
    </AppLayout>
  );
}
