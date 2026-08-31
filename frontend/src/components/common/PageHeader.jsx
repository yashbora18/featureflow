import "./PageHeader.css";

export default function PageHeader({
  icon,
  title,
  description,
  action,
}) {
  return (
    <div className="page-header">

      <div className="page-header-left">

        <div className="page-icon">

          {icon}

        </div>

        <div>

          <h1>{title}</h1>

          <p>{description}</p>

        </div>

      </div>

      <div className="page-header-right">

        {action}

      </div>

    </div>
  );
}
