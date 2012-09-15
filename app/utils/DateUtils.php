<?php
namespace App;

class Utils_DateUtils{

	private static $_formatters=array(
			'G'=>'formatEra',
			'y'=>'formatYear',
			'M'=>'formatMonth',
			'L'=>'formatMonth',
			'd'=>'formatDay',
			'h'=>'formatHour12',
			'H'=>'formatHour24',
			'm'=>'formatMinutes',
			's'=>'formatSeconds',
			'E'=>'formatDayInWeek',
			'c'=>'formatDayInWeek',
			'e'=>'formatDayInWeek',
			'D'=>'formatDayInYear',
			'F'=>'formatDayInMonth',
			'w'=>'formatWeekInYear',
			'W'=>'formatWeekInMonth',
			'a'=>'formatPeriod',
			'k'=>'formatHourInDay',
			'K'=>'formatHourInPeriod',
			'z'=>'formatTimeZone',
			'Z'=>'formatTimeZone',
			'v'=>'formatTimeZone',
	);

	public static function convertDateMysql($dataStr){
		$ok = self::parse($dataStr,'dd/MM/yyyy');
		if($ok){
			$retorno = self::format('yyyy-MM-dd', $ok);
			return $retorno;
		}
		$ok = self::parse($dataStr,'yyyy-MM-dd');
		if($ok){
			return $dataStr;
		}
		return null;
	}

	//converte data no formato yyyy-MM-dd para dd/MM/yyyy
	public static function convertDateNoSql($date){
		$date = explode("-",$date);
		//if ($date[2]<=9) { $date[2]="0".$date[2]; }
		//if ($date[1]<=9) { $date[1]="0".$date[1]; }
		$date = array($date[2], $date[1], $date[0]);
		return $n_date=implode("/", $date);
	}

	//converte numero no formado ##.###,## para #####.##
	public static function convertNumberMysql($numero){
		return str_replace(",",".",str_replace(".", "", $numero));
	}

	/**
	 * Formats a date according to a customized pattern.
	 * @param string $pattern the pattern (See {@link http://www.unicode.org/reports/tr35/#Date_Format_Patterns})
	 * @param mixed $time UNIX timestamp or a string in strtotime format
	 * @return string formatted date time.
	 */
	public static function format($pattern, $time){
		if(is_string($time))
		{
			if(ctype_digit($time))
			$time=(int)$time;
			else
			$time=strtotime($time);
		}
		$date=self::getDate($time,false,false);
		$tokens=self::parseFormat($pattern);
		foreach($tokens as &$token){
			if(is_array($token))				
			$token=self::$token[0]($token[1], $date);
		}
		return implode('',$tokens);
	}
	
	/**
	* Get the year.
	* "yy" will return the last two digits of year.
	* "y...y" will pad the year with 0 in the front, e.g. "yyyyy" will generate "02008" for year 2008.
	* @param string $pattern a pattern.
	* @param array $date result of {@link CTimestamp::getdate}.
	* @return string formatted year
	*/
	public static function formatYear($pattern,$date)
	{
		$year=$date['year'];
		if($pattern==='yy')
		return str_pad($year%100,2,'0',STR_PAD_LEFT);
		else
		return str_pad($year,strlen($pattern),'0',STR_PAD_LEFT);
	}
	
	/**
	 * Get the month.
	 * "M" will return integer 1 through 12;
	 * "MM" will return two digits month number with necessary zero padding, e.g. 05;
	 * "MMM" will return the abrreviated month name, e.g. "Jan";
	 * "MMMM" will return the full month name, e.g. "January";
	 * "MMMMM" will return the narrow month name, e.g. "J";
	 * @param string $pattern a pattern.
	 * @param array $date result of {@link CTimestamp::getdate}.
	 * @return string month name
	 */
	public static function formatMonth($pattern,$date)
	{
		$month=$date['mon'];
		switch($pattern)
		{
			case 'M':
				return $month;
			case 'MM':
				return str_pad($month,2,'0',STR_PAD_LEFT);
			case 'MMM':
				return $this->_locale->getMonthName($month,'abbreviated');
			case 'MMMM':
				return $this->_locale->getMonthName($month,'wide');
			case 'MMMMM':
				return $this->_locale->getMonthName($month,'narrow');
			case 'L':
				return $month;
			case 'LL':
				return str_pad($month,2,'0',STR_PAD_LEFT);
			case 'LLL':
				return $this->_locale->getMonthName($month,'abbreviated', true);
			case 'LLLL':
				return $this->_locale->getMonthName($month,'wide', true);
			case 'LLLLL':
				return $this->_locale->getMonthName($month,'narrow', true);
			default:
				throw new Exception('The pattern for month must be "M", "MM", "MMM", "MMMM", "L", "LL", "LLL" or "LLLL".');
		}
	}
	
	/**
	 * Get the day of the month.
	 * "d" for non-padding, "dd" will always return 2 digits day numbers, e.g. 05.
	 * @param string $pattern a pattern.
	 * @param array $date result of {@link CTimestamp::getdate}.
	 * @return string day of the month
	 */
	public static function formatDay($pattern,$date)
	{
		$day=$date['mday'];
		if($pattern==='d')
		return $day;
		else if($pattern==='dd')
		return str_pad($day,2,'0',STR_PAD_LEFT);
		else
		throw new Exception('The pattern for day of the month must be "d" or "dd".');
	}

	/**
	 * Parses the datetime format pattern.
	 * @param string $pattern the pattern to be parsed
	 * @return array tokenized parsing result
	 */
	public static function parseFormat($pattern){
		static $formats=array();  // cache
		if(isset($formats[$pattern]))
		return $formats[$pattern];
		$tokens=array();
		$n=strlen($pattern);
		$isLiteral=false;
		$literal='';
		for($i=0;$i<$n;++$i)
		{
			$c=$pattern[$i];
			if($c==="'")
			{
				if($i<$n-1 && $pattern[$i+1]==="'")
				{
					$tokens[]="'";
					$i++;
				}
				else if($isLiteral)
				{
					$tokens[]=$literal;
					$literal='';
					$isLiteral=false;
				}
				else
				{
					$isLiteral=true;
					$literal='';
				}
			}
			else if($isLiteral)
			$literal.=$c;
			else
			{
				for($j=$i+1;$j<$n;++$j)
				{
					if($pattern[$j]!==$c)
					break;
				}
				$p=str_repeat($c,$j-$i);
				if(isset(self::$_formatters[$c]))
				$tokens[]=array(self::$_formatters[$c],$p);
				else
				$tokens[]=$p;
				$i=$j-1;
			}
		}
		if($literal!=='')
		$tokens[]=$literal;

		return $formats[$pattern]=$tokens;
	}

	/**
	 * Converts a date string to a timestamp.
	 * @param string $value the date string to be parsed
	 * @param string $pattern the pattern that the date string is following
	 * @param array $defaults the default values for year, month, day, hour, minute and second.
	 * The default values will be used in case when the pattern doesn't specify the
	 * corresponding fields. For example, if the pattern is 'MM/dd/yyyy' and this
	 * parameter is array('minute'=>0, 'second'=>0), then the actual minute and second
	 * for the parsing result will take value 0, while the actual hour value will be
	 * the current hour obtained by date('H'). This parameter has been available since version 1.1.5.
	 * @return integer timestamp for the date string. False if parsing fails.
	 */
	public static function parse($value, $pattern='MM/dd/yyyy', $defaults=array())
	{
		$tokens=self::tokenize($pattern);
		$i=0;
		$n=strlen($value);
		foreach($tokens as $token)
		{
			switch($token)
			{
				case 'yyyy':
					{
						if(($year=self::parseInteger($value,$i,4,4))===false)
						return false;
						$i+=4;
						break;
					}
				case 'yy':
					{
						if(($year=self::parseInteger($value,$i,1,2))===false)
						return false;
						$i+=strlen($year);
						break;
					}
				case 'MM':
					{
						if(($month=self::parseInteger($value,$i,2,2))===false)
						return false;
						$i+=2;
						break;
					}
				case 'M':
					{
						if(($month=self::parseInteger($value,$i,1,2))===false)
						return false;
						$i+=strlen($month);
						break;
					}
				case 'dd':
					{
						if(($day=self::parseInteger($value,$i,2,2))===false)
						return false;
						$i+=2;
						break;
					}
				case 'd':
					{
						if(($day=self::parseInteger($value,$i,1,2))===false)
						return false;
						$i+=strlen($day);
						break;
					}
				case 'h':
				case 'H':
					{
						if(($hour=self::parseInteger($value,$i,1,2))===false)
						return false;
						$i+=strlen($hour);
						break;
					}
				case 'hh':
				case 'HH':
					{
						if(($hour=self::parseInteger($value,$i,2,2))===false)
						return false;
						$i+=2;
						break;
					}
				case 'm':
					{
						if(($minute=self::parseInteger($value,$i,1,2))===false)
						return false;
						$i+=strlen($minute);
						break;
					}
				case 'mm':
					{
						if(($minute=self::parseInteger($value,$i,2,2))===false)
						return false;
						$i+=2;
						break;
					}
				case 's':
					{
						if(($second=self::parseInteger($value,$i,1,2))===false)
						return false;
						$i+=strlen($second);
						break;
					}
				case 'ss':
					{
						if(($second=self::parseInteger($value,$i,2,2))===false)
						return false;
						$i+=2;
						break;
					}
				case 'a':
					{
						if(($ampm=self::parseAmPm($value,$i))===false)
						return false;
						if(isset($hour))
						{
							if($hour==12 && $ampm==='am')
							$hour=0;
							else if($hour<12 && $ampm==='pm')
							$hour+=12;
						}
						$i+=2;
						break;
					}
				default:
					{
						$tn=strlen($token);
						if($i>=$n || substr($value,$i,$tn)!==$token)
						return false;
						$i+=$tn;
						break;
					}
			}
		}
		if($i<$n)
		return false;

		if(!isset($year))
		$year=isset($defaults['year']) ? $defaults['year'] : date('Y');
		if(!isset($month))
		$month=isset($defaults['month']) ? $defaults['month'] : date('n');
		if(!isset($day))
		$day=isset($defaults['day']) ? $defaults['day'] : date('j');

		if(strlen($year)===2)
		{
			if($year>=70)
			$year+=1900;
			else
			$year+=2000;
		}
		$year=(int)$year;
		$month=(int)$month;
		$day=(int)$day;

		if(
		!isset($hour) && !isset($minute) && !isset($second)
		&& !isset($defaults['hour']) && !isset($defaults['minute']) && !isset($defaults['second'])
		)
		$hour=$minute=$second=0;
		else
		{
			if(!isset($hour))
			$hour=isset($defaults['hour']) ? $defaults['hour'] : date('H');
			if(!isset($minute))
			$minute=isset($defaults['minute']) ? $defaults['minute'] : date('i');
			if(!isset($second))
			$second=isset($defaults['second']) ? $defaults['second'] : date('s');
			$hour=(int)$hour;
			$minute=(int)$minute;
			$second=(int)$second;
		}

		if(self::isValidDate($year,$month,$day) && self::isValidTime($hour,$minute,$second))
		return self::getTimestamp($hour,$minute,$second,$month,$day,$year);
		else
		return false;
	}

	/*
	 * @param string $pattern the pattern that the date string is following
	*/
	private static function tokenize($pattern)
	{
		if(!($n=strlen($pattern)))
		return array();
		$tokens=array();
		for($c0=$pattern[0],$start=0,$i=1;$i<$n;++$i)
		{
			if(($c=$pattern[$i])!==$c0)
			{
				$tokens[]=substr($pattern,$start,$i-$start);
				$c0=$c;
				$start=$i;
			}
		}
		$tokens[]=substr($pattern,$start,$n-$start);
		return $tokens;
	}

	/*
	 * @param string $value the date string to be parsed
	* @param integer $offset starting offset
	* @param integer $minLength minimum length
	* @param integer $maxLength maximum length
	*/
	protected static function parseInteger($value,$offset,$minLength,$maxLength)
	{
		for($len=$maxLength;$len>=$minLength;--$len)
		{
			$v=substr($value,$offset,$len);
			if(ctype_digit($v) && strlen($v)>=$minLength)
			return $v;
		}
		return false;
	}

	/*
	 * @param string $value the date string to be parsed
	* @param integer $offset starting offset
	*/
	protected static function parseAmPm($value, $offset)
	{
		$v=strtolower(substr($value,$offset,2));
		return $v==='am' || $v==='pm' ? $v : false;
	}

	/**
	 * Gets day of week, 0 = Sunday,... 6=Saturday.
	 * Algorithm from PEAR::Date_Calc
	 * @param integer $year year
	 * @param integer $month month
	 * @param integer $day day
	 * @return integer day of week
	 */
	public static function getDayofWeek($year, $month, $day)
	{
		/*
			Pope Gregory removed 10 days - October 5 to October 14 - from the year 1582 and
		proclaimed that from that time onwards 3 days would be dropped from the calendar
		every 400 years.

		Thursday, October 4, 1582 (Julian) was followed immediately by Friday, October 15, 1582 (Gregorian).
		*/
		if ($year <= 1582)
		{
			if ($year < 1582 ||
			($year == 1582 && ($month < 10 || ($month == 10 && $day < 15))))
			{
				$greg_correction = 3;
			}
			else
			{
				$greg_correction = 0;
			}
		}
		else
		{
			$greg_correction = 0;
		}

		if($month > 2)
		$month -= 2;
		else
		{
			$month += 10;
			$year--;
		}

		$day =  floor((13 * $month - 1) / 5) +
		$day + ($year % 100) +
		floor(($year % 100) / 4) +
		floor(($year / 100) / 4) - 2 *
		floor($year / 100) + 77 + $greg_correction;

		return $day - 7 * floor($day / 7);
	}

	/**
	 * Checks for leap year, returns true if it is. No 2-digit year check. Also
	 * handles julian calendar correctly.
	 * @param integer $year year to check
	 * @return boolean true if is leap year
	 */
	public static function isLeapYear($year)
	{
		$year = self::digitCheck($year);
		if ($year % 4 != 0)
		return false;

		if ($year % 400 == 0)
		return true;
		// if gregorian calendar (>1582), century not-divisible by 400 is not leap
		else if ($year > 1582 && $year % 100 == 0 )
		return false;
		return true;
	}

	/**
	 * Fix 2-digit years. Works for any century.
	 * Assumes that if 2-digit is more than 30 years in future, then previous century.
	 * @param integer $y year
	 * @return integer change two digit year into multiple digits
	 */
	protected static function digitCheck($y)
	{
		if ($y < 100){
			$yr = (integer) date("Y");
			$century = (integer) ($yr /100);

			if ($yr%100 > 50) {
				$c1 = $century + 1;
				$c0 = $century;
			} else {
				$c1 = $century;
				$c0 = $century - 1;
			}
			$c1 *= 100;
			// if 2-digit year is less than 30 years in future, set it to this century
			// otherwise if more than 30 years in future, then we set 2-digit year to the prev century.
			if (($y + $c1) < $yr+30) $y = $y + $c1;
			else $y = $y + $c0*100;
		}
		return $y;
	}

	/**
	 * Returns 4-digit representation of the year.
	 * @param integer $y year
	 * @return integer 4-digit representation of the year
	 */
	public static function get4DigitYear($y)
	{
		return self::digitCheck($y);
	}

	/**
	 * @return integer get local time zone offset from GMT
	 */
	public static function getGMTDiff()
	{
		static $TZ;
		if (isset($TZ)) return $TZ;

		$TZ = mktime(0,0,0,1,2,1970) - gmmktime(0,0,0,1,2,1970);
		return $TZ;
	}

	/**
	 * Returns the getdate() array.
	 * @param integer|boolean $d original date timestamp. False to use the current timestamp.
	 * @param boolean $fast false to compute the day of the week, default is true
	 * @param boolean $gmt true to calculate the GMT dates
	 * @return array an array with date info.
	 */
	public static function getDate($d=false,$fast=false,$gmt=false)
	{
		if($d===false)
		$d=time();
		if($gmt)
		{
			$tz = date_default_timezone_get();
			date_default_timezone_set('GMT');
			$result = getdate($d);
			date_default_timezone_set($tz);
		}
		else
		{
			$result = getdate($d);
		}
		return $result;
	}

	/**
	 * Checks to see if the year, month, day are valid combination.
	 * @param integer $y year
	 * @param integer $m month
	 * @param integer $d day
	 * @return boolean true if valid date, semantic check only.
	 */
	public static function isValidDate($y,$m,$d)
	{
		return checkdate($m, $d, $y);
	}

	/**
	 * Checks to see if the hour, minute and second are valid.
	 * @param integer $h hour
	 * @param integer $m minute
	 * @param integer $s second
	 * @param boolean $hs24 whether the hours should be 0 through 23 (default) or 1 through 12.
	 * @return boolean true if valid date, semantic check only.
	 * @since 1.0.5
	 */
	public static function isValidTime($h,$m,$s,$hs24=true)
	{
		if($hs24 && ($h < 0 || $h > 23) || !$hs24 && ($h < 1 || $h > 12)) return false;
		if($m > 59 || $m < 0) return false;
		if($s > 59 || $s < 0) return false;
		return true;
	}

	/**
	 * Formats a timestamp to a date string.
	 * @param string $fmt format pattern
	 * @param integer|boolean $d timestamp
	 * @param boolean $is_gmt whether this is a GMT timestamp
	 * @return string formatted date based on timestamp $d
	 */
	public static function formatDate($fmt,$d=false,$is_gmt=false)
	{
		if ($d === false)
		return ($is_gmt)? @gmdate($fmt): @date($fmt);

		// check if number in 32-bit signed range
		if ((abs($d) <= 0x7FFFFFFF))
		{
			// if windows, must be +ve integer
			if ($d >= 0)
			return ($is_gmt)? @gmdate($fmt,$d): @date($fmt,$d);
		}

		$_day_power = 86400;

		$arr = self::getDate($d,true,$is_gmt);

		$year = $arr['year'];
		$month = $arr['mon'];
		$day = $arr['mday'];
		$hour = $arr['hours'];
		$min = $arr['minutes'];
		$secs = $arr['seconds'];

		$max = strlen($fmt);
		$dates = '';

		/*
		 at this point, we have the following integer vars to manipulate:
		$year, $month, $day, $hour, $min, $secs
		*/
		for ($i=0; $i < $max; $i++)
		{
			switch($fmt[$i])
			{
				case 'T': $dates .= date('T');break;
				// YEAR
				case 'L': $dates .= $arr['leap'] ? '1' : '0'; break;
				case 'r': // Thu, 21 Dec 2000 16:01:07 +0200

					// 4.3.11 uses '04 Jun 2004'
					// 4.3.8 uses  ' 4 Jun 2004'
					$dates .= gmdate('D',$_day_power*(3+self::getDayOfWeek($year,$month,$day))).', '
					. ($day<10?'0'.$day:$day) . ' '.date('M',mktime(0,0,0,$month,2,1971)).' '.$year.' ';

					if ($hour < 10) $dates .= '0'.$hour; else $dates .= $hour;

					if ($min < 10) $dates .= ':0'.$min; else $dates .= ':'.$min;

					if ($secs < 10) $dates .= ':0'.$secs; else $dates .= ':'.$secs;

					$gmt = self::getGMTDiff();
					$dates .= sprintf(' %s%04d',($gmt<=0)?'+':'-',abs($gmt)/36);
					break;

				case 'Y': $dates .= $year; break;
				case 'y': $dates .= substr($year,strlen($year)-2,2); break;
				// MONTH
				case 'm': if ($month<10) $dates .= '0'.$month; else $dates .= $month; break;
				case 'Q': $dates .= ($month+3)>>2; break;
				case 'n': $dates .= $month; break;
				case 'M': $dates .= date('M',mktime(0,0,0,$month,2,1971)); break;
				case 'F': $dates .= date('F',mktime(0,0,0,$month,2,1971)); break;
				// DAY
				case 't': $dates .= $arr['ndays']; break;
				case 'z': $dates .= $arr['yday']; break;
				case 'w': $dates .= self::getDayOfWeek($year,$month,$day); break;
				case 'l': $dates .= gmdate('l',$_day_power*(3+self::getDayOfWeek($year,$month,$day))); break;
				case 'D': $dates .= gmdate('D',$_day_power*(3+self::getDayOfWeek($year,$month,$day))); break;
				case 'j': $dates .= $day; break;
				case 'd': if ($day<10) $dates .= '0'.$day; else $dates .= $day; break;
				case 'S':
					$d10 = $day % 10;
					if ($d10 == 1) $dates .= 'st';
					else if ($d10 == 2 && $day != 12) $dates .= 'nd';
					else if ($d10 == 3) $dates .= 'rd';
					else $dates .= 'th';
					break;

					// HOUR
				case 'Z':
					$dates .= ($is_gmt) ? 0 : -self::getGMTDiff(); break;
				case 'O':
					$gmt = ($is_gmt) ? 0 : self::getGMTDiff();

					$dates .= sprintf('%s%04d',($gmt<=0)?'+':'-',abs($gmt)/36);
					break;

				case 'H':
					if ($hour < 10) $dates .= '0'.$hour;
					else $dates .= $hour;
					break;
				case 'h':
					if ($hour > 12) $hh = $hour - 12;
					else {
						if ($hour == 0) $hh = '12';
						else $hh = $hour;
					}

					if ($hh < 10) $dates .= '0'.$hh;
					else $dates .= $hh;
					break;

				case 'G':
					$dates .= $hour;
					break;

				case 'g':
					if ($hour > 12) $hh = $hour - 12;
					else {
						if ($hour == 0) $hh = '12';
						else $hh = $hour;
					}
					$dates .= $hh;
					break;
					// MINUTES
				case 'i': if ($min < 10) $dates .= '0'.$min; else $dates .= $min; break;
				// SECONDS
				case 'U': $dates .= $d; break;
				case 's': if ($secs < 10) $dates .= '0'.$secs; else $dates .= $secs; break;
				// AM/PM
				// Note 00:00 to 11:59 is AM, while 12:00 to 23:59 is PM
				case 'a':
					if ($hour>=12) $dates .= 'pm';
					else $dates .= 'am';
					break;
				case 'A':
					if ($hour>=12) $dates .= 'PM';
					else $dates .= 'AM';
					break;
				default:
					$dates .= $fmt[$i]; break;
				// ESCAPE
				case "\\":
					$i++;
					if ($i < $max) $dates .= $fmt[$i];
					break;
			}
		}
		return $dates;
	}

	/**
	 * Generates a timestamp.
	 * This is the same as the PHP function {@link mktime http://php.net/manual/en/function.mktime.php}.
		* @param integer $hr hour
		* @param integer $min minute
		* @param integer $sec second
		* @param integer|boolean $mon month
		* @param integer|boolean $day day
		* @param integer|boolean $year year
		* @param boolean $is_gmt whether this is GMT time. If true, gmmktime() will be used.
		* @return integer|float a timestamp given a local time.
		*/
	public static function getTimestamp($hr,$min,$sec,$mon=false,$day=false,$year=false,$is_gmt=false)
	{
		if ($mon === false)
		return $is_gmt? @gmmktime($hr,$min,$sec): @mktime($hr,$min,$sec);
		return $is_gmt ? @gmmktime($hr,$min,$sec,$mon,$day,$year) : @mktime($hr,$min,$sec,$mon,$day,$year);
	}
}