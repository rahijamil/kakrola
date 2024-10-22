import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingRows = () => {
  return (
    <>
      <tr>
        <td colSpan={5} className="p-0 w-full pb-4">
          {/* <tr className="border-b border-text-100 block">
            <td colSpan={5} className="p-2">
              <Skeleton width={100} />
            </td>
          </tr> */}
          <tr className="grid grid-cols-[16rem_8rem_8rem_8rem_8rem] md:grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-y border-text-100">
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
          </tr>
          <tr className="grid grid-cols-[16rem_8rem_8rem_8rem_8rem] md:grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-100">
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
          </tr>
          <tr className="grid grid-cols-[16rem_8rem_8rem_8rem_8rem] md:grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-100">
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
          </tr>
        </td>
      </tr>
      <tr>
        <td colSpan={5} className="p-0 w-full pb-4">
          <tr className="border-b border-text-100 block">
            <td colSpan={5} className="p-2">
              <Skeleton width={100} />
            </td>
          </tr>
          <tr className="grid grid-cols-[16rem_8rem_8rem_8rem_8rem] md:grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-100">
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
          </tr>
          <tr className="grid grid-cols-[16rem_8rem_8rem_8rem_8rem] md:grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-100">
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
          </tr>
          <tr className="grid grid-cols-[16rem_8rem_8rem_8rem_8rem] md:grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-100">
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
          </tr>
        </td>
      </tr>
      <tr>
        <td colSpan={5} className="p-0 w-full pb-12">
          <tr className="border-b border-text-100 block">
            <td colSpan={5} className="p-2">
              <Skeleton width={100} />
            </td>
          </tr>
          <tr className="grid grid-cols-[16rem_8rem_8rem_8rem_8rem] md:grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-100">
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
          </tr>
          <tr className="grid grid-cols-[16rem_8rem_8rem_8rem_8rem] md:grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-100">
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
          </tr>
          <tr className="grid grid-cols-[16rem_8rem_8rem_8rem_8rem] md:grid-cols-[40%_15%_15%_15%_15%] divide-x divide-text-200 border-b border-text-100">
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
            <td className="p-2">
              <Skeleton width={"60%"} />
            </td>
          </tr>
        </td>
      </tr>
    </>
  );
};

export default LoadingRows;
