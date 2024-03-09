
export type BrandProps = {
  logo: any;
};
const Brand: React.FC<BrandProps> = (props: any) => {
  return (
    <div className="Brand">
      {props.logo}
      <div className="Brand-title">
        {/* <h1>文丰题库</h1> */}
        {/* <h1>Design</h1> */}
      </div>
    </div>
  )
}

export default Brand;
