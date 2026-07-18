import { Link } from "@tanstack/react-router";

const Footer = () => {
  return (
    <footer className="border-t border-iroko bg-ash py-10 sm:py-14">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-10 md:mb-0">
            <Link
              to="/"
              className="font-display text-3xl font-bold text-cream md:text-4xl"
            >
              deli<span className="text-scotch">.</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10">
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-label-sm text-palm">LOCATIONS</h3>
              <ul className="flex flex-col gap-3 text-sm text-cream/70">
                <li>Lagos</li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-label-sm text-palm">DOWNLOAD</h3>
              <ul className="flex flex-col gap-3 text-sm text-cream/70">
                <li>
                  Google Play{" "}
                  <span className="font-mono text-[0.6875rem] text-cream/60">
                    SOON
                  </span>
                </li>
                <li>
                  App Store{" "}
                  <span className="font-mono text-[0.6875rem] text-cream/60">
                    SOON
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-label-sm text-palm">GET HELP</h3>
              <ul className="flex flex-col gap-3 text-sm text-cream/70">
                <li>
                  <Link to="/contact" className="hover:text-scotch">
                    Email
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-label-sm text-palm">VENDORS</h3>
              <ul className="flex flex-col gap-3 text-sm text-cream/70">
                <li>
                  <Link to="/vendors" className="hover:text-scotch">
                    Become a Vendor
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-8 border-iroko" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-cream/60">
            ©{new Date().getFullYear()},{" "}
            <Link to="/" className="hover:text-cream">
              Deli.
            </Link>
          </span>

          {/* Social icons removed until real Deli accounts exist — placeholder
              "#social-*" anchors were false affordances. Restore with real
              URLs when accounts are live. */}
          <span className="font-mono text-[0.6875rem] tracking-wide text-cream/60">
            SOCIALS COMING SOON
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
