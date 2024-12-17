import React, { useState, useMemo, useEffect } from 'react';
import { pendingUser } from "../../services/Apis";
import { Link } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const PendingUserList = () => {
  const [search, setSearch] = useState('');
  const [counts, setCounts] = useState(10);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const payload = { counts, search, statusWise: 'Pending' };
      const response = await pendingUser(payload);
      setData(response.data?.pendingData || []);
    } catch (error) {
      toast.error(`Error fetching data: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [counts, search]);

  const filteredUsers = useMemo(() => {
    return Array.isArray(data)
      ? data.filter(user =>
          [user.name, user.email, user.application_no, user.username, user.mobile_no, user.region]
            .some(field => field?.toLowerCase().includes(search.toLowerCase()))
        )
      : [];
  }, [data, search]);

  const handleCountsChange = (e) => {
    setCounts(parseInt(e.target.value, 10));
  };

  const exportToExcel = () => {
    const simplifiedData = filteredUsers.map((user, index) => ({
      "S.No.": index + 1,
      "Application No": user.application_no,
      "Reg. Date/Time": user.date_created,
      "User Information": `Name: ${user.name} \nEmail: ${user.email} \nPhone: ${user.mobile_no} \nUser Type: ${user.usertype} \nOrganization: ${user.company_name} \nRegion: ${user.region}`,
      "Account Status": user.is_rejected,
      "Update By": "NA",
    }));
    const ws = XLSX.utils.json_to_sheet(simplifiedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PendingUsers');
    XLSX.writeFile(wb, `Pending_Users.xlsx`);
  };

  return (
    <Sidebar>
      <div className="clear mb-3">
        <div className="section_heading">
          <h2 className="title_heading">CORS Registration List</h2>
        </div>
        <div className="d-flex justify-content-end">
          {data.length > 0 && (
            <button
              className="btn btn-secondary mb-2"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
          )}
        </div>
        <div>
          <div className="box_header">
            <div style={{ padding: "5px 0px" }}>
              <i className="fa-regular fa-rectangle-list mx-3"></i>&nbsp; Total
              Users Pending for Activation: <b>{data.length}</b>
            </div>
          </div>
          <div className="box_body">
            <form className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
              <div className="col-12 col-md-6 d-flex align-items-center mb-3 mb-md-0">
                <label className="me-2">Records per page:</label>
                <select
                  className="form-select"
                  value={counts}
                  onChange={handleCountsChange}
                  style={{ width: "auto" }}
                >
                  <option value="10">10</option>
                  <option value="2">20</option>

                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="col-12 col-md-6 d-flex justify-content-end">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search here ..."
                  className="form-control"
                  style={{
                    maxWidth: "300px",
                  }}
                />
              </div>
            </form>
            <div className="table-div-admin">
              {isLoading ? (
                <div className="d-flex justify-content-center">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
              ) : (
                <table className="data_table">
                  <thead>
                    <tr>
                      <th>SNo</th>
                      <th>Application No</th>
                      <th>Reg. Date/Time</th>
                      <th className="desc">User Information</th>
                      <th>Account Status</th>
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "14px" }}>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((app, index) => (
                        <tr key={app.application_no}>
                          <td>{index + 1}</td>
                          <td>{app.application_no}</td>
                          <td>{app.date_created}</td>
                          <td className="desc">
                            <div>
                              Name: {app.name} <br />
                              Email: {app.email} <br />
                              Phone: {app.mobile_no} <br />
                              User Type: {app.usertype} <br />
                              Organization: {app.company_name} <br />
                              Region: {app.region} <br />
                            </div>
                          </td>
                          <td>{app.is_rejected}</td>
                          <td>
                            <button className="btn btn-warning">
                              <Link
                                to={`/admin/approved/${app.sno}`}
                                className="text-decoration-none text-dark"
                              >
                                <i className="fa-regular fa-pen-to-square text-dark"></i>
                              </Link>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default PendingUserList;



// import React, { useState, useMemo, useEffect } from 'react';
// import { pendingUser } from "../../services/Apis";
// import { Link } from 'react-router-dom';
// import Sidebar from '../layout/Sidebar';
// import * as XLSX from 'xlsx';
// import toast from 'react-hot-toast';

// const PendingUserList = () => {
//   const [search, setSearch] = useState('');
//   const [counts, setCounts] = useState(10);
//   // const [currentPage, setCurrentPage] = useState(1);
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchApplications = async () => {
//     setIsLoading(true);
//     try {
//       const payload = { counts, search,statusWise:'Pending'};
//       const response = await pendingUser(payload);
//       setData(response.data.pendingData);


//     } catch (error) {
//       toast.error('Error fetching data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, [counts, search]);

//   const filteredUsers = useMemo(() => {
//     return Array.isArray(data)
//       ? data.filter(user =>
//           [user.name, user.email, user.application_no, user.username, user.mobile_no, user.region]
//             .some(field => field?.toLowerCase().includes(search.toLowerCase()))
//         )
//       : [];
//   }, [data, search]);

  




//   const handleCountsChange = (e) => {
//     setCounts(parseInt(e.target.value, 10));
//     setCurrentPage(1);
//   };

//   const exportToExcel = () => {
//     const simplifiedData = filteredUsers.map((user, index) => ({
//       "S.No.": index + 1,
//       "Application No": user.application_no,
//       "Reg. Date/Time": user.date_created,
//       "User Information": `Name: ${user.name} \nEmail: ${user.email} \nPhone: ${user.mobile_no} \nUser Type: ${user.usertype} \nOrganization: ${user.company_name} \nRegion: ${user.region}`,
//       "Account Status": user.is_rejected,
//       "Update By": "NA",
//     }));
//     const ws = XLSX.utils.json_to_sheet(simplifiedData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PendingUsers');
//     XLSX.writeFile(wb, `Pending_Page_${currentPage}.xlsx`);
//   };

//   return (
//     <Sidebar>
//       <div className="clear mb-3">
//         <div className="section_heading">
//           <h2 className="title_heading">CORS Registration List</h2>
//         </div>
//         <div className="d-flex justify-content-end">
//           {data.length > 0 && (
//             <div
//               className="mb-2 bg-secondary text-white py-2 px-2"
//               style={{ borderRadius: "5px", cursor: "pointer" }}
//               onClick={exportToExcel}
//             >
//               Export to Excel
//             </div>
//           )}
//         </div>
//         <div>
//           <div className="box_header">
//             <div style={{ padding: "5px 0px" }}>
//               <i className="fa-regular fa-rectangle-list mx-3"></i>&nbsp; Total
//               Users Pending for Activation: <b>{data.length}</b>
//             </div>
//           </div>
//           <div className="box_body">
//             <form className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
//               <div className="col-12 col-md-6 d-flex align-items-center mb-3 mb-md-0">
//                 <label className="me-2">Records per page:</label>
//                 <select
//                   className="form-select"
//                   value={counts}
//                   onChange={handleCountsChange}
//                   style={{ width: "auto" }}
//                 >
//                   <option value="10">10</option>
//                   <option value="2">20</option>
//                   <option value="50">50</option>
//                   <option value="100">100</option>
//                 </select>
//               </div>
//               <div className="col-12 col-md-6 d-flex justify-content-end">
//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search here ..."
//                   className="form-control"
//                   style={{
//                     maxWidth: "300px",
//                   }}
//                 />
//               </div>
//             </form>
//             <div className="table-div-admin">
//               <table className="data_table">
//                 <thead>
//                   <tr>
//                     <th>SNo</th>
//                     <th>Application No</th>
//                     <th>Reg. Date/Time</th>
//                     <th className="desc">User Information</th>
//                     <th>Account Status</th>
//                     <th>Update</th>
//                   </tr>
//                 </thead>
//                 <tbody style={{ fontSize: "14px" }}>
//                   {filteredUsers.length > 0 ? (
//                     filteredUsers.map((app, index) => (
//                       <tr key={app.application_no}>
//                         <td>{index + 1}</td>
//                         <td>{app.application_no}</td>
//                         <td>{app.date_created}</td>
//                         <td className="desc">
//                           <div>
//                             Name: {app.name} <br />
//                             Email: {app.email} <br />
//                             Phone: {app.mobile_no} <br />
//                             User Type: {app.usertype} <br />
//                             Organization: {app.company_name} <br />
//                             Region: {app.region} <br />
//                           </div>
//                         </td>
//                         <td>{app.is_rejected}</td>
//                         <td>
//                           <button className="btn btn-warning">
//                             <Link
//                               to={`/admin/approved/${app.sno}`}
//                               className="text-decoration-none text-dark"
//                             >
//                               <i className="fa-regular fa-pen-to-square text-dark fa-2x"></i>
//                             </Link>
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="text-center">
//                         No data available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
           
//           </div>
//         </div>
//       </div>
//     </Sidebar>
//   );
// };

// export default PendingUserList;



// import React, { useState, useMemo } from 'react';
// import { pendingUser } from "../../services/Apis";
// import { Link } from 'react-router-dom';
// import Sidebar from '../layout/Sidebar';
// import * as XLSX from 'xlsx';
// import toast from 'react-hot-toast';

// const PendingUserList = () => {
//   // const [inputs, setInputs] = useState('');
//   // const [count, setCount] = useState(10);
//   const [search, setInputs] = useState('');
//   const [counts, setCount] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false); 

//   const fetchApplications = async () => {
//     const payload = { counts, inputs };
//     setIsLoading(true);
//     try {
//       const response = await pendingUser(payload);
//       setData(response.data.pendingData);
//       toast.success('Data loaded successfully!');
//     } catch (error) {
//       toast.error('Error fetching data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   React.useEffect(() => {
//     fetchApplications();
//   }, [counts, search]);

//   const filteredUsers = useMemo(() => {
//     return Array.isArray(data)
//       ? data.filter(user =>
//           [user.name, user.email, user.application_no, user.username, user.mobile_no, user.region]
//             .some(field => field?.toLowerCase().includes(inputs.toLowerCase()))
//         )
//       : [];
//   }, [data, search]);

//   const paginatedUsers = useMemo(() => {
//     const startIndex = (currentPage - 1) * counts;
//     const endIndex = startIndex + counts;
//     return filteredUsers.slice(startIndex, endIndex);
//   }, [filteredUsers, currentPage, counts]);

//   const totalPages = Math.ceil(filteredUsers.length / counts);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   const handleChange = (e) => {
//     setCount(parseInt(e.target.value, 10));
//     setCurrentPage(1);
//   };

//   const exportToExcel = () => {
//     const simplifiedData = paginatedUsers.map((user, index) => ({
//       "S.No.": index + 1,
//       "Application No": user.application_no,
//       "Reg. Date/Time": user.date_created,
//       "User Information": `Name: ${user.name} \nEmail: ${user.email} \nPhone: ${user.mobile_no} \nUser Type: ${user.usertype} \nOrganization: ${user.company_name} \nRegion: ${user.region}`,
//       "Account Status": user.is_rejected,
//       "Update By": "NA",
//     }));
//     const ws = XLSX.utils.json_to_sheet(simplifiedData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//     XLSX.writeFile(wb, 'Pending_Page_' + currentPage + '.xlsx');
//   };

//   return (
//     <Sidebar>
//       <div className="clear mb-3">
//         <div className="section_heading">
//           <h2 className="title_heading">CORS Registration List</h2>
//         </div>
//         <div className="d-flex justify-content-end">
//           <div
//             className="mb-2 bg-secondary text-white py-2 px-2"
//             style={{ borderRadius: "5px", cursor: "pointer" }}
//             onClick={exportToExcel}
//             disabled={data.length === 0}
//           >
//             Export to Excel
//           </div>
//         </div>
//         <div>
//           <div className="box_header">
//             <div style={{ padding: "5px 0px" }}>
//               <i className="fa-regular fa-rectangle-list mx-3"></i>&nbsp; Total
//               Users Pending for Activation: <b>{data.length}</b>
//             </div>
//           </div>
//           <div>
//             <div className="box_body">
//               <form className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
//                 <div className="col-12 col-md-6 d-flex align-items-center mb-3 mb-md-0">
//                   <label className="me-2">Records per page:</label>
//                   <select
//                     className="form-select"
//                     value={counts}
//                     onChange={handleChange}
//                     style={{ width: "auto" }}
//                   >
//                     <option value="10">10</option>
//                     <option value="2">20</option>
//                     <option value="50">50</option>
//                     <option value="100">100</option>
//                   </select>
//                 </div>
//                 <div className="col-12 col-md-6 d-flex justify-content-end">
//                   <input
//                     type="text"
//                     value={search}
//                     onChange={(e) => setInputs(e.target.value)}
//                     placeholder="Search here ..."
//                     className="form-control"
//                     style={{
//                       maxWidth: "300px",
//                     }}
//                   />
//                 </div>
//               </form>
//               <div className="table-div-admin">
//                 <table className="data_table">
//                   <thead>
//                     <tr>
//                       <th>SNo</th>
//                       <th>Application No</th>
//                       <th>Reg. Date/Time</th>
//                       <th className="desc">User Information</th>
//                       <th>Account Status</th>
//                       <th>Update</th>
//                     </tr>
//                   </thead>
//                   <tbody style={{ fontSize: "14px" }}>
//                     {paginatedUsers.length > 0 ? (
//                       paginatedUsers.map((app, index) => (
//                         <tr key={app.application_no}>
//                           <td>{(currentPage - 1) * counts + index + 1}</td>
//                           <td>{app.application_no}</td>
//                           <td>{app.date_created}</td>
//                           <td className="desc">
//                             <div>
//                               Name: {app.name} <br />
//                               Email: {app.email} <br />
//                               Phone: {app.mobile_no} <br />
//                               User Type: {app.usertype} <br />
//                               Organization: {app.company_name} <br />
//                               Region: {app.region} <br />
//                             </div>
//                           </td>
//                           <td>
//                             <div>{app.is_rejected}</div>
//                           </td>
//                           <td>
//                             <button className="btn btn-warning">
//                               <Link
//                                 to={`/admin/approved/${app.sno}`}
//                                 className="text-decoration-none text-dark"
//                               >
//                                 <i className="fa-regular fa-pen-to-square text-dark fa-2x"></i>
//                               </Link>
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="8" className="text-center">
//                           No data available
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {filteredUsers.length > counts && (
//               <div className="pagination-controls d-flex justify-content-between mt-3">
//                 <div className="pagination-controls  mt-3">
//                   <button className="btn btn-primary mx-1" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>« Previous</button>

//                   {(() => {
//                     const maxButtons = 5;
//                     const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
//                     const endPage = Math.min(totalPages, startPage + maxButtons - 1);
//                     const adjustedStartPage = Math.max(1, endPage - maxButtons + 1);

//                     return Array.from({ length: endPage - adjustedStartPage + 1 }, (_, index) => {
//                       const page = adjustedStartPage + index;
//                       return (<button key={page} className={`btn mx-1 ${currentPage === page ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handlePageChange(page)}>{page}</button>)
//                     });
//                   })()}

//                   <button className="btn btn-primary mx-1" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}> Next » </button>
//                 </div>
//                 <p className="mt-4"> Showing 1 to {counts} of {data.length} entries</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </Sidebar>
//   );
// };

// export default PendingUserList;



// import React, { useState, useMemo } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { pendingUser } from "../../services/Apis";
// import { Link } from 'react-router-dom';
// import Sidebar from '../layout/Sidebar';
// import * as XLSX from 'xlsx';
// import toast from 'react-hot-toast';

// const PendingUserList = () => {
//   const [inputs, setInputs] = useState('');
//   const [count, setCount] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const fetchApplications = async () => {
//     const data = { count, inputs };
//     try {
//       const response = await pendingUser(data);
//       return response.data.pendingData;
//     } catch (error) {
//       toast.error('Error fetching data:', error);
//       return [];
//     }
//   };

//   const { data = [], isLoading, isError, error } = useQuery({
//     queryKey: ["pendingUsers"],
//     queryFn: fetchApplications,
//     onSuccess: () => {
//       toast.success('Data loaded successfully!');
//     },
//     onError: (err) => {
//       toast.error(`Error: ${err.message}`);
//     },
//   });

//   const filteredUsers = useMemo(() => {
//     return Array.isArray(data)
//       ? data.filter(user =>
//         [user.name, user.email, user.application_no, user.username, user.mobile_no, user.region]
//           .some(field => field?.toLowerCase().includes(inputs.toLowerCase()))
//       )
//       : [];
//   }, [data, inputs]);

//   const paginatedUsers = useMemo(() => {
//     const startIndex = (currentPage - 1) * count;
//     const endIndex = startIndex + count;
//     return filteredUsers.slice(startIndex, endIndex);
//   }, [filteredUsers, currentPage, count]);

//   const totalPages = Math.ceil(filteredUsers.length / count);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   const handleChange = (e) => {
//     setCount(parseInt(e.target.value, 10));
//     setCurrentPage(1);
//   };

//   const exportToExcel = () => {
//     const simplifiedData = paginatedUsers.map((user, index) => ({
//       "S.No.": index + 1,
//       "Application No": user.application_no,
//       "Reg. Date/Time": user.date_created,
//       "User Information": `Name: ${user.name} \nEmail: ${user.email} \nPhone: ${user.mobile_no} \nUser Type: ${user.usertype} \nOrganization: ${user.company_name} \nRegion: ${user.region}`,
//       "Account Status": user.is_rejected,
//       "Update By": "NA",
//     }));
//     const ws = XLSX.utils.json_to_sheet(simplifiedData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//     XLSX.writeFile(wb, 'Pending_Page_' + currentPage + '.xlsx');
//   };

//   return (
//     <Sidebar>
//       <div className="clear mb-3">
//         <div className="section_heading">
//           <h2 className="title_heading">CORS Registration List</h2>
//         </div>
//         <div className="d-flex justify-content-end">
//           <div
//             className="mb-2 bg-secondary text-white py-2 px-2"
//             style={{ borderRadius: "5px", cursor: "pointer" }}
//             onClick={exportToExcel}
//             disabled={data.length === 0}
//           >
//             Export to Excel
//           </div>
//         </div>
//         <div>
//           <div className="box_header">
//             <div style={{ padding: "5px 0px" }}>
//               <i className="fa-regular fa-rectangle-list mx-3"></i>&nbsp; Total
//               Users Pending for Activation: <b>{data.length}</b>
//             </div>
//           </div>
//           <div>
//             <div className="box_body">
//               <form className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
//                 <div className="col-12 col-md-6 d-flex align-items-center mb-3 mb-md-0">
//                   <label className="me-2">Records per page:</label>
//                   <select
//                     className="form-select"
//                     value={count}
//                     onChange={handleChange}
//                     style={{ width: "auto" }}
//                   >
//                     <option value="10">10</option>
//                     <option value="2">20</option>
//                     <option value="50">50</option>
//                     <option value="100">100</option>
//                   </select>
//                 </div>
//                 <div className="col-12 col-md-6 d-flex justify-content-end">
//                   <input
//                     type="text"
//                     value={inputs}
//                     onChange={(e) => setInputs(e.target.value)}
//                     placeholder="Search here ..."
//                     className="form-control"
//                     style={{
//                       maxWidth: "300px",
//                     }}
//                   />
//                 </div>
//               </form>
//               <div className="table-div-admin">
//                 <table className="data_table">
//                   <thead>
//                     <tr>
//                       <th>SNo</th>
//                       <th>Application No</th>
//                       <th>Reg. Date/Time</th>
//                       <th className="desc">User Information</th>
//                       <th>Account Status</th>
//                       <th>Update</th>
//                     </tr>
//                   </thead>
//                   <tbody style={{ fontSize: "14px" }}>
//                     {paginatedUsers.length > 0 ? (
//                       paginatedUsers.map((app, index) => (
//                         <tr key={app.application_no}>
//                           <td>{(currentPage - 1) * count + index + 1}</td>
//                           <td>{app.application_no}</td>
//                           <td>{app.date_created}</td>
//                           <td className="desc">
//                             <div>
//                               Name: {app.name} <br />
//                               Email: {app.email} <br />
//                               Phone: {app.mobile_no} <br />
//                               User Type: {app.usertype} <br />
//                               Organization: {app.company_name} <br />
//                               Region: {app.region} <br />
//                             </div>
//                           </td>
//                           <td>
//                             <div>{app.is_rejected}</div>
//                           </td>
//                           <td>
//                             <button className="btn btn-warning">
//                               <Link
//                                 to={`/admin/approved/${app.sno}`}
//                                 className="text-decoration-none text-dark"
//                               >
//                                 <i className="fa-regular fa-pen-to-square text-dark fa-2x"></i>
//                               </Link>
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="8" className="text-center">
//                           No data available
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {filteredUsers.length > count && (
//               <div className="pagination-controls d-flex justify-content-between mt-3">
//                 <div className="pagination-controls  mt-3">
//                   <button className="btn btn-primary mx-1" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>« Previous</button>

//                   {(() => {
//                     const maxButtons = 5;
//                     const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
//                     const endPage = Math.min(totalPages, startPage + maxButtons - 1);
//                     const adjustedStartPage = Math.max(1, endPage - maxButtons + 1);

//                     return Array.from({ length: endPage - adjustedStartPage + 1 }, (_, index) => {
//                       const page = adjustedStartPage + index;
//                       return (<button key={page} className={`btn mx-1 ${currentPage === page ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handlePageChange(page)}>{page}</button>)
//                     });
//                   })()}

//                   <button className="btn btn-primary mx-1" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}> Next » </button>
//                 </div>
//                 <p className="mt-4"> Showing 1 to {count} of {data.length} entries</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </Sidebar>
//   );
// };

// export default PendingUserList;




