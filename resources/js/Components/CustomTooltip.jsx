// recharts doesn't export the default tooltip,
// but it's located in the package lib so you can get to it anyways
import DefaultTooltipContent from "recharts/lib/component/DefaultTooltipContent";

const CustomTooltip = (props) => {
  if (props.active && props.payload) {
    console.log(props);
    return (
      <div className="p-3 rounded-lg shadow-sm bg-white">
        {props.payload.map((item) => (
          <div key={item.dataKey} className="mb-2 last:!mb-0">
            <p className="m-0 capitalize">
              {item.dataKey.replace("offices.", "")}
            </p>
            <div>
              <p className="m-0 text-xl capitalize font-bold">
                {item.payload.total}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return <></>;
};

export default CustomTooltip;
