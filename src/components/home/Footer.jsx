import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-scroll";

function Footer() {
  return (
    <>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <a href="#" className="hover:text-yellow-400">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <FaInstagram />
            </a>
          </div>
          <p className="text-sm mb-2">© 2024 Uizzy. All rights reserved.</p>
          <p className="text-sm">
            <Link
              to="privacy"
              smooth={true}
              duration={500}
              className="hover:text-yellow-400"
            >
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link
              to="terms"
              smooth={true}
              duration={500}
              className="hover:text-yellow-400"
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
