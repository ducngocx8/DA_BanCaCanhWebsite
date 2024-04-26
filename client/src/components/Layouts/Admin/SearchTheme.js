import React from "react";

export default function SearchTheme({ title, handleSearch }) {
  const handleChangeKeyword = (e) => {
    handleSearch(e.target.value);
  };
  return (
    <div className="row">
      <div className="col-12">
        <div className="col-lg-12 stretch-card" style={{ padding: 0 }}>
          <div className="card">
            <div className="card-body">
              <h4
                className="card-title"
                style={{ marginBottom: "0 !important" }}
              >
                {title}
              </h4>
              <div id="form_search_submit">
                <div className="input-group" style={{ padding: "10px 0px" }}>
                  <input
                    type="search"
                    className="form-control rounded"
                    placeholder="Search"
                    name="keyword"
                    defaultValue={""}
                    aria-label="Search"
                    onChange={(e) => handleChangeKeyword(e)}
                    aria-describedby="search-addon"
                  />
                  <button type="submit" className="btn_search_admin">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
