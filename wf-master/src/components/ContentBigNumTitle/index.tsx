import './index.less';
export type ContentBigNumTitleProps = {
  num: any;
  title: any;
  style: any;
};
const ContentBigNumTitle: React.FC<ContentBigNumTitleProps> = (props: any) => {
  return (
    <div className="ContentBigNumTitle" style={props.style}>
      <div className="ContentBigNumTitle-num">
        {props.num}
      </div>
      <div className="ContentBigNumTitle-title">
        {props.title}
      </div>
      <div className="ContentBigNumTitle-line" />
    </div>
  )
}

export default ContentBigNumTitle;
