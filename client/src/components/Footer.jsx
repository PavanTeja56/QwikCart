import qlogo from "../components/images/qlogo.png";

function Footer() {
  return (
    <footer className="bg-orange-200 text-gray-800 border-t border-orange-300 pt-8 pb-4 mt-10">
      <div className="text-center mb-6">
        <a href="#navbar" className="text-orange-700 font-semibold hover:underline">
          Back to Top
        </a>
      </div>

      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-around items-center gap-10">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img src={qlogo} alt="QwickCart Logo" className="w-28 h-auto" />
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold text-orange-800 mb-2">Contact Us</h2>
          <p>Email: <a href="mailto:adminQwickCart@gmail.com" className="text-blue-700 hover:underline">adminQwikFood@gmail.com</a></p>
          <p>Phone: <a href="tel:+919848411239" className="hover:underline">+91 98484 11239</a></p>
        </div>

        {/* Social Media Icons */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold text-orange-800 mb-2">Our Social Media</h2>
          <div className="flex justify-center md:justify-start gap-4 text-2xl text-orange-700 mt-2">
            <a href="#" className="hover:text-blue-700" aria-label="Facebook"><i className="fa-brands fa-facebook"></i></a>
            <a href="#" className="hover:text-pink-600" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="hover:text-green-600" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
            <a href="#" className="hover:text-black" aria-label="X (Twitter)"><i className="fa-brands fa-x-twitter"></i></a>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 mt-6">© 2025 QwikFood. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
