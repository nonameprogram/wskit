import path from "node:path";
import nextra from 'nextra';

const withNextra = nextra({
})

export default withNextra({
  turbopack: {
    root: path.join(__dirname),
  },
  output: "standalone",
});
