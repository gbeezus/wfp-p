interface DynamicRouteProps<Segment extends string = string> {
  params: Record<Exclude<string, Segment>, string | undefined> &
    Record<Segment, string>;
  searchParams: Record<string, string | string[] | undefined>;
}

export default DynamicRouteProps;
