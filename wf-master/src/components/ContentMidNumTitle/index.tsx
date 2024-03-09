import './index.less';
export type ContentMidNumTitleProps = {
  num: any;
  title: any;
  style: any;
};
const ContentMidNumTitle: React.FC<ContentMidNumTitleProps> = (props: any) => {
  return (
    <div className="ContentMidNumTitle" style={props.style}>
      <div className="ContentMidNumTitle-num">
        {props.num}
      </div>
      <div className="ContentMidNumTitle-title">
        {props.title}
      </div>
    </div>
  )
}

export default ContentMidNumTitle;
